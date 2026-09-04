'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const sheets = require('./sheets');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'responses.xlsx');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Column schema (one column per field). Order defines the Excel column order.
// ---------------------------------------------------------------------------
// v3.2 instrument: 67 Likert items + demographics + experimental metadata.
// Column order follows the questionnaire: B (background) -> C (pre-stimulus)
// -> E (product reactions) -> F (technology acceptance) -> G (outcomes)
// -> H (manipulation checks) -> contact.
const COLUMNS = [
  'id', 'submitted_at', 'cell_id', 'frame', 'cobrand', 'completion_time_sec',
  'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8_1', 'b8_2', 'b8_3', 'b9', 'b10', 'b11',
  // B12-B15
  'pec1', 'pec2', 'pec3',
  'gds1', 'gds2', 'gds3',
  'tpr1', 'tpr2', 'tpr3',
  'mv1', 'mv2', 'mv3',
  // C (pre-stimulus)
  'dvc1', 'dvc2', 'dvc3', 'dvc4',
  'ac1',
  'saf1', 'saf2', 'saf3', 'saf4',
  // E (product reactions)
  'psa1', 'psa2', 'psa3', 'psa4', 'psa5', 'psa6',
  'tp1', 'tp2', 'tp3', 'tp4', 'tp5', 'tp6',
  'pf1', 'pf2', 'pf3',
  'psi1', 'psi2', 'psi3', 'psi4', 'psi5',
  // F (acceptance of the verification technology)
  'pu1', 'pu2', 'pu3', 'pu4',
  'peou1', 'peou2', 'peou3', 'peou4',
  'itu1', 'itu2', 'itu3',
  'pe1', 'pe2', 'pe3',
  'sn1', 'sn2', 'sn3',
  'ac2',
  // G (outcomes)
  'pi1', 'pi2', 'pi3', 'pi4',
  'res1', 'res2', 'res3', 'res4',
  'g3_wtp', 'g4_reason', 'g5_comment',
  // H (manipulation checks) + contact
  'mc_a', 'mc_b', 'email'
];

// Serialize all Excel writes so concurrent submissions never corrupt the file.
let writeQueue = Promise.resolve();

async function getSheet() {
  const wb = new ExcelJS.Workbook();
  if (fs.existsSync(DATA_FILE)) {
    await wb.xlsx.readFile(DATA_FILE);
  }
  let ws = wb.getWorksheet('Responses');
  if (!ws) ws = wb.addWorksheet('Responses');
  return { wb, ws };
}

async function getCellCounts() {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  if (!fs.existsSync(DATA_FILE)) return counts;
  const { ws } = await getSheet();
  if (ws.rowCount > 1) {
    const header = ws.getRow(1).values; // 1-based array
    const cellIdx = header.indexOf('cell_id');
    for (let r = 2; r <= ws.rowCount; r++) {
      const v = ws.getRow(r).getCell(cellIdx).value;
      if (v !== null && v !== undefined && counts[v] !== undefined) counts[v]++;
    }
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Assign a participant to the least-filled cell (block randomization).
app.get('/api/assign', async (req, res) => {
  try {
    const counts = await getCellCounts();
    const min = Math.min(...Object.values(counts));
    const candidates = [1, 2, 3, 4].filter((c) => counts[c] === min);
    const cell = candidates[Math.floor(Math.random() * candidates.length)];
    res.json({ cell, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'assign failed' });
  }
});

app.get('/api/counts', async (req, res) => {
  try {
    // Prefer the Google Sheet (source of truth for the cloud data).
    const sheetCounts = await sheets.getCellCounts();
    if (sheetCounts) return res.json(sheetCounts);

    // Fall back to the local Excel file.
    const counts = await getCellCounts();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    res.json({ counts, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'counts failed' });
  }
});

// Append one response row to the central Excel file.
app.post('/api/submit', (req, res) => {
  const data = req.body || {};
  if (!data.cell_id) return res.status(400).json({ error: 'missing cell_id' });

  writeQueue = writeQueue
    .then(async () => {
      const { wb, ws } = await getSheet();
      if (ws.rowCount === 0) ws.addRow(COLUMNS);
      const id = ws.rowCount; // rowCount includes header, so this is the new row number
      const row = [];
      for (const col of COLUMNS) {
        let v = data[col];
        if (col === 'id') v = id;
        if (col === 'submitted_at') v = new Date().toISOString();
        row.push(v !== undefined && v !== null ? v : '');
      }
      ws.addRow(row);
      await wb.xlsx.writeFile(DATA_FILE);

      // Also append to Google Sheets (primary cloud copy). If it fails, the
      // local Excel row is already saved, so no response is lost.
      await sheets.appendRow(row, COLUMNS);

      return id;
    })
    .then((id) => res.json({ ok: true, id }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'write failed' });
    });
});

// Download the Excel file.
app.get('/api/export', async (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ error: 'no data yet' });
  res.download(DATA_FILE, 'responses.xlsx');
});

// Download a CSV export (handy for SPSS/AMOS/R).
app.get('/api/export.csv', async (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ error: 'no data yet' });
  try {
    const { ws } = await getSheet();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="responses.csv"');
    res.write('\uFEFF'); // BOM so Excel opens UTF-8 correctly
    const rows = [];
    ws.eachRow((row) => rows.push(row.values.slice(1)));
    const csvCell = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    for (const r of rows) res.write(r.map(csvCell).join(',') + '\r\n');
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'csv export failed' });
  }
});

app.listen(PORT, () => {
  sheets.init(COLUMNS);
  console.log(`Paper 3 survey site running on http://localhost:${PORT}`);
  console.log(`Admin page: http://localhost:${PORT}/admin.html`);
});