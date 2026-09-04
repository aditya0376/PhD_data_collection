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
//
// Each column has a short `key` (used to read the submitted payload) and a
// descriptive `header` (written to the spreadsheet so the data is easy to
// identify during analysis). The header keeps the construct code as a prefix
// (e.g. PEC1_) so it stays analysis-friendly, followed by a readable label.
const SCHEMA = [
  { key: 'id', header: 'id' },
  { key: 'submitted_at', header: 'submitted_at' },
  { key: 'cell_id', header: 'cell_id' },
  { key: 'frame', header: 'frame' },
  { key: 'cobrand', header: 'cobrand' },
  { key: 'version', header: 'version' },
  { key: 'completion_time_sec', header: 'completion_time_sec' },
  // B1-B11 demographics
  { key: 'b1', header: 'B1_ParentGuardian_1to16' },
  { key: 'b2', header: 'B2_Gender' },
  { key: 'b3', header: 'B3_Age' },
  { key: 'b4', header: 'B4_Education' },
  { key: 'b5', header: 'B5_Occupation' },
  { key: 'b6', header: 'B6_Income' },
  { key: 'b7', header: 'B7_NumChildren_1to16' },
  { key: 'b8_1', header: 'B8_Children_1to5' },
  { key: 'b8_2', header: 'B8_Children_6to10' },
  { key: 'b8_3', header: 'B8_Children_11to16' },
  { key: 'b9', header: 'B9_Residence' },
  { key: 'b10', header: 'B10_QRScanFrequency' },
  { key: 'b11', header: 'B11_WhoBuys' },
  // B12-B15
  { key: 'pec1', header: 'PEC1_PhoneCanScan' },
  { key: 'pec2', header: 'PEC2_NetworkData' },
  { key: 'pec3', header: 'PEC3_ShopNetwork' },
  { key: 'gds1', header: 'GDS1_ConfidentSmartphone' },
  { key: 'gds2', header: 'GDS2_NewApp' },
  { key: 'gds3', header: 'GDS3_GoodWithTech' },
  { key: 'tpr1', header: 'TPR1_InHurry' },
  { key: 'tpr2', header: 'TPR2_ChildrenShopping' },
  { key: 'tpr3', header: 'TPR3_NoTimeCompare' },
  { key: 'mv1', header: 'MV1_PlanDay' },
  { key: 'mv2', header: 'MV2_TryNewFood' },
  { key: 'mv3', header: 'MV3_StayHome' },
  // C (pre-stimulus)
  { key: 'dvc1', header: 'DVC1_ConfidentScan' },
  { key: 'dvc2', header: 'DVC2_KnowWhatToDo' },
  { key: 'dvc3', header: 'DVC3_TrustInfo' },
  { key: 'dvc4', header: 'DVC4_Skills' },
  { key: 'ac1', header: 'AC1_AttentionCheck_Disagree' },
  { key: 'saf1', header: 'SAF1_SwitchBrand' },
  { key: 'saf2', header: 'SAF2_NoLabelCheck' },
  { key: 'saf3', header: 'SAF3_RefusedGenuine' },
  { key: 'saf4', header: 'SAF4_CheckOrigin' },
  // E (product reactions)
  { key: 'psa1', header: 'PSA1_InfoEnough' },
  { key: 'psa2', header: 'PSA2_ClearRecord' },
  { key: 'psa3', header: 'PSA3_AccurateComplete' },
  { key: 'psa4', header: 'PSA4_JourneyVisible' },
  { key: 'psa5', header: 'PSA5_IdentifyGroups' },
  { key: 'psa6', header: 'PSA6_KnowReceives' },
  { key: 'tp1', header: 'TP1_Capable' },
  { key: 'tp2', header: 'TP2_AssurancesReliable' },
  { key: 'tp3', header: 'TP3_Honest' },
  { key: 'tp4', header: 'TP4_ChildBestInterest' },
  { key: 'tp5', header: 'TP5_Depend' },
  { key: 'tp6', header: 'TP6_Sincere' },
  { key: 'pf1', header: 'PF1_FairProduction' },
  { key: 'pf2', header: 'PF2_PaidReasonably' },
  { key: 'pf3', header: 'PF3_FairSupplyChain' },
  { key: 'psi1', header: 'PSI1_ImproveLives' },
  { key: 'psi2', header: 'PSI2_ReducePoverty' },
  { key: 'psi3', header: 'PSI3_FairWages' },
  { key: 'psi4', header: 'PSI4_MakeDifference' },
  { key: 'psi5', header: 'PSI5_DoesGood' },
  // F (acceptance of the verification technology)
  { key: 'pu1', header: 'PU1_BetterDecision' },
  { key: 'pu2', header: 'PU2_UsefulInfo' },
  { key: 'pu3', header: 'PU3_ImproveQuality' },
  { key: 'pu4', header: 'PU4_UsefulOverall' },
  { key: 'peou1', header: 'PEOU1_EasyLearn' },
  { key: 'peou2', header: 'PEOU2_EasyScan' },
  { key: 'peou3', header: 'PEOU3_ClearUnderstand' },
  { key: 'peou4', header: 'PEOU4_EasyOverall' },
  { key: 'itu1', header: 'ITU1_IntendScan' },
  { key: 'itu2', header: 'ITU2_TryFuture' },
  { key: 'itu3', header: 'ITU3_PlanUse' },
  { key: 'pe1', header: 'PE1_Interesting' },
  { key: 'pe2', header: 'PE2_Enjoyable' },
  { key: 'pe3', header: 'PE3_Pleasant' },
  { key: 'sn1', header: 'SN1_ImportantPeople' },
  { key: 'sn2', header: 'SN2_ValueOpinions' },
  { key: 'sn3', header: 'SN3_FamilyExpect' },
  { key: 'ac2', header: 'AC2_AttentionCheck_StronglyAgree' },
  // G (outcomes)
  { key: 'pi1', header: 'PI1_ConsiderBuying' },
  { key: 'pi2', header: 'PI2_LikelyPurchase' },
  { key: 'pi3', header: 'PI3_ChooseOverSimilar' },
  { key: 'pi4', header: 'PI4_IntendNextShop' },
  { key: 'res1', header: 'RES1_CannotAfford' },
  { key: 'res2', header: 'RES2_NotDo' },
  { key: 'res3', header: 'RES3_GovernmentJob' },
  { key: 'res4', header: 'RES4_TrustBrands' },
  { key: 'g3_wtp', header: 'G3_WillingnessToPay' },
  { key: 'g4_reason', header: 'G4_ReasonNothing' },
  { key: 'g5_comment', header: 'G5_BeneficiaryComment' },
  // H (manipulation checks) + contact
  { key: 'mc_a', header: 'H1_ContentRecall' },
  { key: 'mc_b', header: 'H2_MarksRecall' },
  { key: 'email', header: 'email' }
];

// Short keys used to read the submitted payload.
const COLUMNS = SCHEMA.map((s) => s.key);
// Descriptive headers written to the spreadsheet.
const HEADERS = SCHEMA.map((s) => s.header);

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

  // Readable label for which of the 4 questionnaire versions was used.
  const VERSION_LABELS = {
    1: 'V1_Technical_NoCoBrand',
    2: 'V2_Technical_CoBrand',
    3: 'V3_Beneficiary_NoCoBrand',
    4: 'V4_Beneficiary_CoBrand'
  };

  writeQueue = writeQueue
    .then(async () => {
      const { wb, ws } = await getSheet();
      if (ws.rowCount === 0) ws.addRow(HEADERS);
      const id = ws.rowCount; // rowCount includes header, so this is the new row number
      const row = [];
      for (const col of COLUMNS) {
        let v = data[col];
        if (col === 'id') v = id;
        if (col === 'submitted_at') v = new Date().toISOString();
        if (col === 'version') v = VERSION_LABELS[data.cell_id] || ('Cell_' + data.cell_id);
        row.push(v !== undefined && v !== null ? v : '');
      }
      ws.addRow(row);
      await wb.xlsx.writeFile(DATA_FILE);

      // Also append to Google Sheets (primary cloud copy). If it fails, the
      // local Excel row is already saved, so no response is lost.
      await sheets.appendRow(row, HEADERS);

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
  sheets.init(HEADERS);
  console.log(`Paper 3 survey site running on http://localhost:${PORT}`);
  console.log(`Admin page: http://localhost:${PORT}/admin.html`);
});