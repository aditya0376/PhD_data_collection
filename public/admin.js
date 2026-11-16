'use strict';

const CELL_META = {
  1: { frame: 'Technical', cobrand: 'No' },
  2: { frame: 'Technical', cobrand: 'Yes' },
  3: { frame: 'Beneficiary', cobrand: 'No' },
  4: { frame: 'Beneficiary', cobrand: 'Yes' }
};

function badge(text, cls) {
  return `<span class="badge ${cls}">${text}</span>`;
}

async function load() {
  const res = await fetch('/api/counts');
  const data = await res.json();
  document.getElementById('total').textContent = data.total;

  const srcNote = document.getElementById('src-note');
  srcNote.textContent = data.source === 'google-sheet'
    ? ' (from the Google Sheet)'
    : ' (from the server file — Google Sheet not authoritative)';

  const warn = document.getElementById('warn');
  if (data.warning) {
    warn.textContent = 'Storage warning: ' + data.warning;
    warn.style.display = 'block';
  } else {
    warn.style.display = 'none';
  }

  const store = document.getElementById('store-note');
  const s = data.sheet || {};
  store.textContent = s.ok
    ? `Google Sheet rows: ${s.total}` + (s.lastOkAt ? ` · last successful write ${new Date(s.lastOkAt).toLocaleString()}` : '')
    : `Google Sheet unavailable: ${s.error || 'unknown error'}`;

  const tbody = document.getElementById('cell-rows');
  let html = '';
  for (const id of [1, 2, 3, 4]) {
    const m = CELL_META[id];
    const c = window.CELLS[id];
    const count = data.counts[id] || 0;
    html += `<tr>
      <td>${id}</td>
      <td>${c.name}</td>
      <td>${badge(m.frame === 'Technical' ? 'Technical' : 'Beneficiary', m.frame === 'Technical' ? 'tech' : 'ben')}</td>
      <td>${badge(m.cobrand === 'Yes' ? 'Co-brand' : 'No co-brand', m.cobrand === 'Yes' ? 'co' : 'noco')}</td>
      <td>${count}</td>
      <td><a href="preview.html?cell=${id}" target="_blank">Preview</a></td>
    </tr>`;
  }
  tbody.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', load);

// ---------------------------------------------------------------------------
// Manual entry: upload a .xlsx/.csv and merge its rows into the Google Sheet.
// ---------------------------------------------------------------------------
function readFileBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).replace(/^data:[^,]*,/, ''));
    reader.onerror = () => reject(new Error('could not read the file'));
    reader.readAsDataURL(file);
  });
}

function showImportResult(text, isError) {
  const el = document.getElementById('import-result');
  el.textContent = text;
  el.style.display = 'block';
  el.classList.toggle('err', !!isError);
}

async function runImport() {
  const fileEl = document.getElementById('import-file');
  const btn = document.getElementById('import-btn');
  const dryRun = document.getElementById('import-dry').checked;
  const file = fileEl.files && fileEl.files[0];

  if (!file) {
    showImportResult('Choose a .xlsx or .csv file first.', true);
    return;
  }
  if (file.size > 25 * 1024 * 1024) {
    showImportResult('That file is larger than 25 MB. Split it and upload the parts.', true);
    return;
  }

  btn.disabled = true;
  showImportResult('Uploading and checking ' + file.name + ' …', false);

  try {
    const dataBase64 = await readFileBase64(file);
    const res = await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, dataBase64, dryRun })
    });
    const data = await res.json();

    if (!res.ok) {
      showImportResult('Import failed: ' + (data.error || res.status) +
        (data.foundHeaders ? '\n\nFirst columns seen in the file: ' + data.foundHeaders.join(', ') : '') +
        (data.problems && data.problems.length ? '\n\n' + data.problems.join('\n') : ''), true);
      return;
    }

    const lines = [];
    lines.push((dryRun ? 'CHECK ONLY — nothing was written.' : 'Merged into the Google Sheet.'));
    lines.push('File: ' + data.filename);
    lines.push('Columns matched: ' + data.columnsMatched + ' of ' + data.columnsInSchema);
    lines.push('Rows found in file: ' + data.rowsInFile);
    lines.push((dryRun ? 'Rows that would be added: ' : 'Rows added: ') + data.toImport);
    lines.push('Rows already in the sheet (skipped): ' + data.alreadyPresent);
    if (data.imported !== undefined) lines.push('Imported: ' + data.imported);
    if (data.message) lines.push(data.message);
    if (data.total !== undefined) lines.push('Total responses now: ' + data.total + ' (' + data.source + ')');
    if (data.problems && data.problems.length) {
      lines.push('', 'Notes:');
      data.problems.forEach((p) => lines.push('  - ' + p));
    }
    showImportResult(lines.join('\n'), false);

    if (!dryRun) {
      fileEl.value = '';
      await load();
    }
  } catch (err) {
    showImportResult('Upload error: ' + err.message, true);
  } finally {
    btn.disabled = false;
  }
}

const importBtn = document.getElementById('import-btn');
if (importBtn) importBtn.addEventListener('click', runImport);