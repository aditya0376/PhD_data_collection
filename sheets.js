'use strict';

// ---------------------------------------------------------------------------
// Google Sheets integration.
//
// The server appends each response to a Google Sheet (primary, survives
// server restarts) AND to the local Excel file (automatic backup/fallback).
//
// Configuration (environment variables):
//   GOOGLE_SERVICE_ACCOUNT_KEY  path to the service-account JSON key file
//   GOOGLE_SHEET_ID             the spreadsheet ID (from the sheet URL)
//
// If either variable is missing, Sheets is simply disabled and the server
// keeps working with the local Excel file only.
// ---------------------------------------------------------------------------

const fs = require('fs');
const { google } = require('googleapis');

let sheetsClient = null;
let sheetId = null;
let headerWritten = false;

function init(columns) {
  const keySetting = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  sheetId = process.env.GOOGLE_SHEET_ID;

  if (!keySetting || !sheetId) {
    console.log('[sheets] disabled (set GOOGLE_SERVICE_ACCOUNT_KEY and GOOGLE_SHEET_ID to enable)');
    return false;
  }

  let key;
  try {
    // The key can be provided either as a file path (local) or as the raw JSON
    // content (cloud hosts, where you paste the whole JSON into the env var).
    if (keySetting.trim().startsWith('{')) {
      key = JSON.parse(keySetting);
    } else {
      if (!fs.existsSync(keySetting)) {
        console.error('[sheets] key file not found:', keySetting);
        return false;
      }
      key = JSON.parse(fs.readFileSync(keySetting, 'utf8'));
    }
  } catch (err) {
    console.error('[sheets] could not parse service account key:', err.message);
    return false;
  }

  try {
    const auth = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    sheetsClient = google.sheets({ version: 'v4', auth });
    headerWritten = false;
    console.log('[sheets] enabled for spreadsheet', sheetId);
    return true;
  } catch (err) {
    console.error('[sheets] init failed:', err.message);
    sheetsClient = null;
    return false;
  }
}

async function ensureHeader(columns) {
  if (!sheetsClient || headerWritten) return;
  // Read the entire first row (range '1:1' is width-independent).
  const res = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Responses!1:1'
  });
  const existing = res.data.values && res.data.values[0];
  if (!existing || existing.length === 0) {
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Responses!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [columns] }
    });
  } else {
    // Refuse to append if the stored header does not match the current
    // instrument schema - misaligned rows would corrupt the dataset.
    const matches = columns.length === existing.length &&
      columns.every((c, i) => existing[i] === c);
    if (!matches) {
      throw new Error(
        'Google Sheet header does not match the v3.2 instrument schema. ' +
        'Clear the Responses tab (or rename it) so a fresh header can be written, then restart the server.'
      );
    }
  }
  headerWritten = true;
}

// Append one response row. Returns true on success, false on any failure.
async function appendRow(values, columns) {
  if (!sheetsClient) return false;
  try {
    await ensureHeader(columns);
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Responses!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] }
    });
    return true;
  } catch (err) {
    console.error('[sheets] append failed:', err.message);
    return false;
  }
}

// Read per-cell response counts from the Google Sheet.
// Returns { counts, total } or null if Sheets is unavailable.
async function getCellCounts() {
  if (!sheetsClient) return null;
  try {
    const res = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Responses'
    });
    const rows = res.data.values || [];
    if (rows.length < 2) return { counts: { 1: 0, 2: 0, 3: 0, 4: 0 }, total: 0 };
    const header = rows[0];
    const cellIdx = header.indexOf('cell_id');
    if (cellIdx === -1) return { counts: { 1: 0, 2: 0, 3: 0, 4: 0 }, total: 0 };
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (let i = 1; i < rows.length; i++) {
      const v = rows[i][cellIdx];
      if (v !== undefined && v !== null && counts[v] !== undefined) counts[v]++;
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return { counts, total };
  } catch (err) {
    console.error('[sheets] getCellCounts failed:', err.message);
    return null;
  }
}

module.exports = { init, appendRow, getCellCounts };