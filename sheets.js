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
let lastError = null;
let lastOkAt = null;

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
  // Read the whole tab: we need to know whether any response rows already
  // exist before deciding what to do with a mismatched header.
  const res = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Responses'
  });
  const rows = res.data.values || [];
  const existing = rows[0] || [];
  const dataRows = rows.length > 1 ? rows.length - 1 : 0;

  if (existing.length === 0) {
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Responses!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [columns] }
    });
    headerWritten = true;
    return;
  }

  const matches = columns.length === existing.length &&
    columns.every((c, i) => existing[i] === c);
  if (matches) {
    headerWritten = true;
    return;
  }

  // Header no longer matches the instrument (e.g. a column was added).
  // Safe to repair automatically only when the stored header is clearly the
  // same instrument (nearly all column names still occur) AND no response
  // rows exist yet. Anything else still refuses, because rewriting could
  // misalign or destroy existing data.
  const shared = existing.filter((c) => columns.includes(c)).length;
  const overlap = shared / Math.max(existing.length, 1);
  if (dataRows === 0 && overlap >= 0.8) {
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Responses!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [columns] }
    });
    console.warn(
      '[sheets] stored header was stale (no data rows); rewrote it to the current ' +
      `${columns.length}-column schema.`
    );
    headerWritten = true;
    return;
  }

  throw new Error(
    'Google Sheet header does not match the current instrument schema (' +
    `sheet has ${existing.length} columns, this build expects ${columns.length}, ` +
    `only ${shared} name(s) shared) and the tab contains ${dataRows} response row(s). ` +
    'Export those rows first, clear the Responses tab (A1:ZZ), then restart the server ' +
    'so a fresh header can be written.'
  );
}

// Append one response row. Returns true on success, false on any failure.
async function appendRow(values, columns) {
  if (!sheetsClient) {
    lastError = 'Google Sheets not configured';
    return false;
  }
  try {
    await ensureHeader(columns);
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Responses!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] }
    });
    lastError = null;
    lastOkAt = new Date().toISOString();
    return true;
  } catch (err) {
    // Force a fresh header check on the next submission instead of failing
    // silently forever.
    headerWritten = false;
    lastError = err.message;
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

// Append many response rows in one go (used by the admin import).
// Returns { ok, appended } or { ok: false, error }.
async function appendRows(rows, columns) {
  if (!sheetsClient) return { ok: false, error: 'Google Sheets not configured' };
  if (!rows.length) return { ok: true, appended: 0 };
  try {
    await ensureHeader(columns);
    // Chunk so a large import cannot exceed the API request size limit.
    for (let i = 0; i < rows.length; i += 500) {
      await sheetsClient.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Responses!A1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: rows.slice(i, i + 500) }
      });
    }
    lastError = null;
    lastOkAt = new Date().toISOString();
    return { ok: true, appended: rows.length };
  } catch (err) {
    headerWritten = false;
    lastError = err.message;
    console.error('[sheets] batch append failed:', err.message);
    return { ok: false, error: err.message };
  }
}

// Every row currently in the sheet, or null when Sheets is unavailable.
async function getRows() {
  if (!sheetsClient) return null;
  try {
    const res = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Responses'
    });
    return res.data.values || [];
  } catch (err) {
    lastError = err.message;
    console.error('[sheets] read failed:', err.message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Findings-summary contacts, kept in their own tab so an email address can never
// be joined to a response row (plan Section 9.3).
// ---------------------------------------------------------------------------
const CONTACT_HEADERS = ['submitted_at', 'email'];
let contactsReady = false;

async function ensureTab(title, headers) {
  const meta = await sheetsClient.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: 'sheets.properties.title'
  });
  const has = (meta.data.sheets || []).some((s) => s.properties.title === title);
  if (!has) {
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] }
    });
  }
  const res = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${title}'!1:1`
  });
  const existing = (res.data.values || [])[0] || [];
  if (existing.length === 0) {
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `'${title}'!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] }
    });
  }
}

async function ensureContactsTab() {
  if (contactsReady) return;
  await ensureTab('Contacts', CONTACT_HEADERS);
  contactsReady = true;
}

async function appendContact(email) {
  if (!sheetsClient) return { ok: false, error: 'Google Sheets not configured' };
  try {
    await ensureContactsTab();
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "'Contacts'!A1",
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [[new Date().toISOString(), email]] }
    });
    return { ok: true };
  } catch (err) {
    lastError = err.message;
    console.error('[sheets] contact append failed:', err.message);
    return { ok: false, error: err.message };
  }
}

// Screen-outs are recorded on their own tab: they must appear in the exclusion
// flow diagram, but they must not count as responses or affect cell balance.
const SCREENOUT_HEADERS = ['submitted_at', 'b1', 'lang', 'lang_start', 'mode', 'phase', 'reason'];
let screenoutsReady = false;

async function appendScreenout(record) {
  if (!sheetsClient) return { ok: false, error: 'Google Sheets not configured' };
  try {
    if (!screenoutsReady) {
      await ensureTab('Screenouts', SCREENOUT_HEADERS);
      screenoutsReady = true;
    }
    const row = SCREENOUT_HEADERS.map((h) => {
      const v = record[h];
      return v === undefined || v === null ? '' : v;
    });
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "'Screenouts'!A1",
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] }
    });
    return { ok: true };
  } catch (err) {
    lastError = err.message;
    console.error('[sheets] screenout append failed:', err.message);
    return { ok: false, error: err.message };
  }
}

// Status of the Google Sheets pipeline, for the admin page / diagnostics.
function status() {
  return {
    enabled: !!sheetsClient,
    sheetId: sheetId || null,
    headerVerified: headerWritten,
    lastError: lastError || null,
    lastOkAt: lastOkAt || null
  };
}

module.exports = { init, appendRow, appendRows, getRows, getCellCounts, appendContact, appendScreenout, status };