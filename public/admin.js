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