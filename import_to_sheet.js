'use strict';
// Import response rows from a downloaded responses.xlsx / responses.csv into the
// Google Sheet, so rows that only ever reached the server's temporary Excel file
// are not lost. Safe to re-run: rows already present (same submitted_at +
// cell_id + email) are skipped.
//
// Usage: node import_to_sheet.js <path-to-file> [--dry-run]

const fs = require('fs');
const path = require('path');
const APP = __dirname;
const ExcelJS = require(path.join(APP, 'node_modules/exceljs'));
const { google } = require(path.join(APP, 'node_modules/googleapis'));
const key = require(path.join(APP, 'service-account.json'));

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1PKzd96paNlyvCGUJ7FgEj7a-DTgHIIlIJWsmcieTe3E';

function schemaHeaders() {
  const src = fs.readFileSync(path.join(APP, 'server.js'), 'utf8');
  const s = src.indexOf('const SCHEMA = [');
  const e = src.indexOf('];', s);
  const SCHEMA = eval(src.slice(s + 'const SCHEMA = '.length, e + 1));
  return SCHEMA.map((x) => x.header);
}

async function readRows(file) {
  if (/\.csv$/i.test(file)) {
    const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
    // Minimal RFC4180 parser: handles quoted fields with embedded commas/quotes.
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
  await wb.xlsx.readFile(file);
  const ws = wb.worksheets[0];
  const rows = [];
  ws.eachRow((r) => rows.push(r.values.slice(1).map((v) => (v === null || v === undefined ? '' : v))));
  return rows;
}

(async () => {
  const file = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  if (!file || !fs.existsSync(file)) {
    console.error('Usage: node import_to_sheet.js <responses.xlsx|responses.csv> [--dry-run]');
    process.exit(1);
  }

  const SCHEMA_HEADERS = schemaHeaders();
  const all = await readRows(file);
  if (all.length < 2) { console.log('No data rows found in', file); return; }

  const srcHeader = all[0].map((h) => String(h).trim());
  const dataRows = all.slice(1);

  const auth = new google.auth.JWT({
    email: key.client_email, key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const api = google.sheets({ version: 'v4', auth });

  const current = await api.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Responses' });
  const existing = current.data.values || [];
  const header = existing[0] || [];
  const matches = header.length === SCHEMA_HEADERS.length && header.every((v, i) => v === SCHEMA_HEADERS[i]);
  console.log('sheet header matches schema:', matches, '| existing data rows:', Math.max(0, existing.length - 1));
  if (!matches) {
    console.error('ABORT: sheet header does not match server.js schema; fix the header first.');
    process.exit(2);
  }

  const at = header.indexOf('submitted_at');
  const ci = header.indexOf('cell_id');
  const ei = header.indexOf('email');
  const seen = new Set();
  for (let i = 1; i < existing.length; i++) {
    const r = existing[i];
    seen.add([r[at], r[ci], r[ei]].join('|'));
  }

  const toAppend = [];
  for (const r of dataRows) {
    const flat = {};
    srcHeader.forEach((h, i) => { flat[h] = r[i] === undefined ? '' : r[i]; });
    const idKey = [flat.submitted_at, flat.cell_id, flat.email].join('|');
    if (seen.has(idKey)) { console.log('skip (already in sheet):', idKey); continue; }
    toAppend.push(SCHEMA_HEADERS.map((h) => {
      const v = flat[h];
      if (v === undefined || v === null) return '';
      return v instanceof Date ? v.toISOString() : String(v);
    }));
    seen.add(idKey);
  }

  console.log('rows to import:', toAppend.length);
  if (!toAppend.length) return;
  if (dryRun) { console.log(JSON.stringify(toAppend, null, 2)); console.log('--dry-run: nothing written'); return; }

  await api.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Responses!A1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: toAppend }
  });

  const after = await api.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Responses' });
  console.log('imported. sheet data rows now:', Math.max(0, (after.data.values || []).length - 1));
})().catch((err) => { console.error('FAILED:', err.message); process.exit(1); });
