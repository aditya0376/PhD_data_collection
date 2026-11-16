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
  { key: 'lang', header: 'lang' },
  { key: 'mode', header: 'mode' },
  { key: 'phase', header: 'phase' },
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
  // v3.3: PSA is four condition-neutral items (visibility, clarity,
  // comprehensibility, global). No accuracy judgement and no journey wording.
  { key: 'psa1', header: 'PSA1_StagesAndPeopleVisible' },
  { key: 'psa2', header: 'PSA2_ClearWhatRecordSays' },
  { key: 'psa3', header: 'PSA3_EasyToUnderstand' },
  { key: 'psa4', header: 'PSA4_ClearOverallPicture' },
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
  // H (manipulation checks)
  // H1 categorical recall of the content block, H2 recall of the marks, and the
  // two scale-rated manipulation-strength items required by the plan (Step 2).
  // Email is deliberately NOT a column (plan Section 9.3): it is collected in a
  // separate form after submission and stored in its own tab.
  { key: 'mc_a', header: 'H1_ContentRecall' },
  { key: 'mc_b', header: 'H2_MarksRecall' },
  { key: 'mc_share', header: 'H3_BeneficiaryVisibility' },
  { key: 'mc_stages', header: 'H4_StageVisibility' }
];

// Short keys used to read the submitted payload.
const COLUMNS = SCHEMA.map((s) => s.key);
// Descriptive headers written to the spreadsheet.
const HEADERS = SCHEMA.map((s) => s.header);

// Readable label for which of the 4 questionnaire versions was used.
const VERSION_LABELS = {
  1: 'V1_Technical_NoCoBrand',
  2: 'V2_Technical_CoBrand',
  3: 'V3_Beneficiary_NoCoBrand',
  4: 'V4_Beneficiary_CoBrand'
};
const FRAME_BY_CELL = { 1: 0, 2: 0, 3: 1, 4: 1 };
const COBRAND_BY_CELL = { 1: 0, 2: 1, 3: 0, 4: 1 };

// Columns that stay text even when they look numeric.
const TEXT_KEYS = new Set(['submitted_at', 'version', 'lang', 'mode', 'phase', 'g4_reason', 'g5_comment']);

// Turn an uploaded cell value into what the spreadsheet should receive.
function coerceValue(key, v) {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object') {
    if ('result' in v) return coerceValue(key, v.result); // formula
    if ('text' in v) return coerceValue(key, v.text); // hyperlink
    if ('richText' in v) return coerceValue(key, v.richText.map((t) => t.text).join(''));
    return String(v);
  }
  if (typeof v === 'string') {
    const t = v.trim();
    if (t === '') return '';
    if (!TEXT_KEYS.has(key) && !Number.isNaN(Number(t))) return Number(t);
    return t;
  }
  return v;
}

// Read an uploaded workbook or CSV into a raw table (array of rows of cells).
async function parseUpload(filename, buffer) {
  if (/\.csv$/i.test(filename)) {
    const text = buffer.toString('utf8').replace(/^\uFEFF/, '');
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (ch === '"') inQuotes = false;
        else field += ch;
      } else if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
      else field += ch;
    }
    if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
    return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error('the workbook has no sheets');
  const rows = [];
  ws.eachRow((r) => rows.push(r.values.slice(1)));
  return rows;
}

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
    const { counts } = await getAuthoritativeCounts();
    const min = Math.min(...Object.values(counts));
    const candidates = [1, 2, 3, 4].filter((c) => counts[c] === min);
    const cell = candidates[Math.floor(Math.random() * candidates.length)];
    res.json({ cell, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'assign failed' });
  }
});

// Which store is authoritative right now, plus per-cell counts.
// The Google Sheet is the durable store, but it must never be trusted blindly:
// if a write silently failed, the sheet holds fewer responses than the server
// file, and reporting the sheet alone would show 0 responses.
async function getAuthoritativeCounts() {
  const localCounts = await getCellCounts();
  const localTotal = Object.values(localCounts).reduce((a, b) => a + b, 0);

  let sheet = null;
  try {
    sheet = await sheets.getCellCounts();
  } catch (err) {
    console.error(err);
  }
  const st = sheets.status();

  if (sheet && sheet.total >= localTotal) {
    return {
      counts: sheet.counts,
      total: sheet.total,
      source: 'google-sheet',
      sheet: { ok: true, total: sheet.total, lastOkAt: st.lastOkAt },
      local: { counts: localCounts, total: localTotal },
      warning: null
    };
  }

  const payload = {
    counts: localCounts,
    total: localTotal,
    source: 'server-file',
    sheet: sheet
      ? { ok: true, total: sheet.total, lastOkAt: st.lastOkAt }
      : { ok: false, error: st.lastError || (st.enabled ? 'could not read sheet' : 'not configured') },
    local: { counts: localCounts, total: localTotal },
    warning: null
  };

  if (st.enabled && sheet && sheet.total < localTotal) {
    payload.warning =
      (localTotal - sheet.total) + ' response(s) exist only in the temporary server file, not in the ' +
      'Google Sheet. Download them now. ' +
      (st.lastError
        ? 'Sheet write error: ' + st.lastError
        : 'No sheet write was recorded by this server process (it restarted after those responses).');
  } else if (!st.enabled && localTotal > 0) {
    payload.warning =
      'Google Sheets is not configured, so responses live only in the temporary server file. ' +
      'Download them after every session.';
  }

  return payload;
}

// Minimum coverage the design commits to (plan Section 9.2). Reported on the
// admin page so the quotas are visible while sampling, not after.
const QUOTA_RULES = [
  { key: 'rural', label: 'Rural or semi-urban (B9 = 2 or 3)', target: 150 },
  { key: 'belowGrad', label: 'Below graduate (B4 = 1, 2 or 3)', target: 200 },
  { key: 'nonScanner', label: 'Never / once-or-twice scanner (B10 = 1 or 2)', target: 100 }
];

async function getQuotas() {
  const rows = await sheets.getRows();
  if (!rows || rows.length < 2) return null;
  const header = rows[0];
  const i9 = header.indexOf('B9_Residence');
  const i4 = header.indexOf('B4_Education');
  const i10 = header.indexOf('B10_QRScanFrequency');
  if (i9 < 0 || i4 < 0 || i10 < 0) return null;

  const out = QUOTA_RULES.map((q) => ({ key: q.key, label: q.label, target: q.target, current: 0 }));
  for (let i = 1; i < rows.length; i++) {
    const b9 = String(rows[i][i9]);
    const b4 = String(rows[i][i4]);
    const b10 = String(rows[i][i10]);
    if (b9 === '2' || b9 === '3') out[0].current++;
    if (b4 === '1' || b4 === '2' || b4 === '3') out[1].current++;
    if (b10 === '1' || b10 === '2') out[2].current++;
  }
  out.forEach((q) => { q.met = q.current >= q.target; });
  return out;
}

app.get('/api/counts', async (req, res) => {
  try {
    const payload = await getAuthoritativeCounts();
    payload.quotas = await getQuotas();
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'counts failed' });
  }
});

// Diagnostics for the storage pipeline (admin page uses this).
app.get('/api/status', (req, res) => {
  res.json({
    sheet: sheets.status(),
    dataFile: fs.existsSync(DATA_FILE),
    // Which build is actually running: Render injects RENDER_GIT_COMMIT at
    // deploy time, and startedAt proves whether this process has restarted.
    commit: process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT || null,
    startedAt: new Date(Date.now() - Math.round(process.uptime() * 1000)).toISOString(),
    uptimeSec: Math.round(process.uptime())
  });
});

// Append one response row to the central Excel file.
app.post('/api/submit', (req, res) => {
  const data = req.body || {};
  if (!data.cell_id) return res.status(400).json({ error: 'missing cell_id' });

  // Derive the condition if the caller omitted it, so a submission without
  // frame/cobrand can never leave those analysis columns blank.
  const cell = Number(data.cell_id);
  if (cell in FRAME_BY_CELL) {
    if (data.frame === undefined || data.frame === '') data.frame = FRAME_BY_CELL[cell];
    if (data.cobrand === undefined || data.cobrand === '') data.cobrand = COBRAND_BY_CELL[cell];
  }
  if (!data.mode) data.mode = 'self';
  if (!data.phase) data.phase = 'main';

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
        row.push(v !== undefined && v !== null && v !== '' ? coerceValue(col, v) : '');
      }
      ws.addRow(row);
      await wb.xlsx.writeFile(DATA_FILE);

      // Also append to Google Sheets (primary cloud copy). If it fails, the
      // local Excel row is already saved, so no response is lost - but the
      // failure is reported so it cannot pass unnoticed.
      const sheetSaved = await sheets.appendRow(row, HEADERS);
      if (!sheetSaved) {
        console.error(`[submit] response ${id} saved to the local file but NOT to the Google Sheet.`);
      }

      return { id, sheetSaved };
    })
    .then(({ id, sheetSaved }) => res.json({ ok: true, id, sheetSaved }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'write failed' });
    });
});

// Import an uploaded sheet (.xlsx or .csv) of responses into the Google Sheet.
// Accepts JSON { filename, dataBase64, dryRun } so no multipart dependency is
// needed; the admin page reads the chosen file and sends it this way.
app.post('/api/import', express.json({ limit: '25mb' }), async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.dataBase64) return res.status(400).json({ error: 'no file received' });

    let buffer;
    try {
      buffer = Buffer.from(String(body.dataBase64).replace(/^data:[^,]*,/, ''), 'base64');
    } catch (err) {
      return res.status(400).json({ error: 'the upload could not be decoded' });
    }

    const filename = body.filename || 'upload.xlsx';
    let table;
    try {
      table = await parseUpload(filename, buffer);
    } catch (err) {
      return res.status(400).json({ error: 'could not read the file: ' + err.message });
    }
    if (!table || table.length < 2) {
      return res.status(400).json({ error: 'the file has no data rows below its header' });
    }

    // Map uploaded columns onto the schema by descriptive header OR short key,
    // so exports from older builds (93 columns, short keys) also import.
    const headerRow = table[0].map((h) => String(h === undefined || h === null ? '' : h).trim());
    const idxByKey = new Map();
    headerRow.forEach((h, i) => {
      if (!h) return;
      const match = SCHEMA.find((s) => s.header === h) || SCHEMA.find((s) => s.key === h);
      if (match && !idxByKey.has(match.key)) idxByKey.set(match.key, i);
    });

    if (!idxByKey.has('cell_id')) {
      return res.status(400).json({
        error: 'no cell_id column found. Expected the survey export headers (e.g. cell_id, b1, …).',
        foundHeaders: headerRow.slice(0, 12)
      });
    }
    if (idxByKey.size < 3) {
      return res.status(400).json({
        error: 'only ' + idxByKey.size + ' recognised column(s). Upload a responses.xlsx / responses.csv ' +
          'exported from this survey site.',
        foundHeaders: headerRow.slice(0, 12)
      });
    }

    const problems = [];
    const records = [];
    table.slice(1).forEach((r, n) => {
      const line = n + 2; // spreadsheet row number, header is row 1
      if (!r || r.every((c) => c === undefined || c === null || String(c).trim() === '')) return;
      const rec = {};
      for (const [key, i] of idxByKey) rec[key] = r[i];

      const cell = Number(coerceValue('cell_id', rec.cell_id));
      if (!(cell in FRAME_BY_CELL)) {
        problems.push(`row ${line}: cell_id ${JSON.stringify(rec.cell_id)} is not 1-4, skipped`);
        return;
      }
      rec.cell_id = cell;
      // Frame, co-brand and version are derived from the cell so an imported
      // row can never contradict its own condition.
      rec.frame = FRAME_BY_CELL[cell];
      rec.cobrand = COBRAND_BY_CELL[cell];
      rec.version = VERSION_LABELS[cell];

      if (rec.submitted_at) {
        const t = Date.parse(rec.submitted_at);
        if (Number.isNaN(t)) {
          problems.push(`row ${line}: submitted_at ${JSON.stringify(rec.submitted_at)} is not a date, using the import time`);
          rec.submitted_at = new Date().toISOString();
        } else {
          rec.submitted_at = new Date(t).toISOString();
        }
      } else {
        rec.submitted_at = new Date().toISOString();
      }
      records.push(rec);
    });

    if (!records.length) {
      return res.status(400).json({ error: 'no usable rows in the file', problems });
    }

    // Skip rows already in the sheet (same submitted_at + cell_id + email), so
    // re-uploading the same file is harmless.
    const existing = await sheets.getRows();
    const sheetStatus = sheets.status();
    if (existing === null) {
      return res.status(502).json({
        error: 'could not read the Google Sheet, so duplicates cannot be ruled out. Nothing was written. ' +
          (sheetStatus.lastError || '')
      });
    }
    const existingHeader = existing[0] || [];
    const atIdx = existingHeader.indexOf('submitted_at');
    const cellIdx = existingHeader.indexOf('cell_id');
    const timeIdx = existingHeader.indexOf('completion_time_sec');
    const seen = new Set();
    for (let i = 1; i < existing.length; i++) {
      const r = existing[i];
      seen.add([r[atIdx], r[cellIdx], r[timeIdx]].join('|'));
    }

    const toAppend = [];
    const skipped = [];
    for (const rec of records) {
      const key = [rec.submitted_at, rec.cell_id, rec.completion_time_sec === undefined ? '' : rec.completion_time_sec].join('|');
      if (seen.has(key)) { skipped.push(key); continue; }
      seen.add(key);
      toAppend.push(COLUMNS.map((col) => (col === 'id' ? '' : coerceValue(col, rec[col]))));
    }

    const summary = {
      ok: true,
      dryRun: !!body.dryRun,
      filename,
      columnsMatched: idxByKey.size,
      columnsInSchema: SCHEMA.length,
      rowsInFile: records.length,
      toImport: toAppend.length,
      alreadyPresent: skipped.length,
      problems
    };

    if (body.dryRun) return res.json(summary);
    if (!toAppend.length) {
      return res.json({ ...summary, imported: 0, message: 'every row is already in the Google Sheet' });
    }

    const result = await sheets.appendRows(toAppend, HEADERS);
    if (!result.ok) {
      return res.status(502).json({
        ...summary,
        ok: false,
        error: 'Google Sheet write failed, nothing was imported: ' + result.error
      });
    }

    // Best-effort mirror into the local Excel file so /api/export includes the
    // imported rows too. The sheet already has them, so a failure here is not
    // fatal.
    try {
      const { wb, ws } = await getSheet();
      if (ws.rowCount === 0) ws.addRow(HEADERS);
      for (const row of toAppend) ws.addRow(row);
      await wb.xlsx.writeFile(DATA_FILE);
    } catch (err) {
      console.error('[import] local Excel mirror failed:', err.message);
      summary.problems.push('rows are in the Google Sheet, but the local Excel copy could not be updated: ' + err.message);
    }

    const counts = await getAuthoritativeCounts();
    res.json({ ...summary, imported: toAppend.length, total: counts.total, source: counts.source });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'import failed: ' + err.message });
  }
});

// Findings-summary email capture. Deliberately a separate endpoint and a
// separate tab: it must never be possible to join an address to a response.
app.post('/api/subscribe', async (req, res) => {
  const email = String((req.body || {}).email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid email address' });
  }
  const stamp = new Date().toISOString();
  const result = await sheets.appendContact(email);
  if (!result.ok) {
    // Fall back to a local file so a participant is not turned away.
    try {
      fs.appendFileSync(
        path.join(DATA_DIR, 'contacts.csv'),
        `"${stamp}","${email.replace(/"/g, '""')}"\n`,
        'utf8'
      );
      return res.json({ ok: true, stored: 'server-file' });
    } catch (err) {
      console.error(err);
      return res.status(502).json({ ok: false, error: 'could not store the address' });
    }
  }
  res.json({ ok: true, stored: 'google-sheet' });
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