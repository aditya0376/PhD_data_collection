'use strict';

// ---------------------------------------------------------------------------
// The four experimental cells (2x2: FRAME x COBRAND).
//   frame  0 = Technical, 1 = Beneficiary
//   cobrand 0 = Absent,   1 = Present (FSSAI + AGMARK marks)
// ---------------------------------------------------------------------------
const CELLS = {
  1: { frame: 0, cobrand: 0, name: 'Technical · No Co-brand' },
  2: { frame: 0, cobrand: 1, name: 'Technical · Co-brand' },
  3: { frame: 1, cobrand: 0, name: 'Beneficiary · No Co-brand' },
  4: { frame: 1, cobrand: 1, name: 'Beneficiary · Co-brand' }
};

// Correct answers to the manipulation checks (Section H), per cell.
//   mc_a: 'a' = price sharing (beneficiary) | 'b' = stages checked (technical)
//   mc_b: marks shown only in co-brand cells.
const MC_CORRECT = {
  1: { mc_a: 'b', mc_b: 'No' },
  2: { mc_a: 'b', mc_b: 'Yes' },
  3: { mc_a: 'a', mc_b: 'No' },
  4: { mc_a: 'a', mc_b: 'Yes' }
};

// ---------------------------------------------------------------------------
// Stimulus architecture (v3.2): all four versions share an identical header,
// an identical opening sentence, an identical closing tamper-resistance
// sentence and an identical Verification ID. Only the middle content block
// varies by FRAME, and only the certification block varies by COBRAND. Both
// middle blocks list six entities so visual density matches.
// ---------------------------------------------------------------------------
const SHARED_OPEN =
  'Every step of this product\u2019s journey \u2014 from farm to shelf \u2014 is stored in a secure digital record that cannot be changed once entered.';
const SHARED_CLOSE =
  'This record is tamper-resistant. It cannot be altered by anyone in the supply chain.';

const STAGES = ['Harvest', 'Processing', 'Packaging', 'Storage', 'Transport', 'Retail'];

const SHARES = [
  { label: 'Farmer', pct: 30, color: '#2e9e5b' },
  { label: 'Processing unit', pct: 20, color: '#3b82c4' },
  { label: 'Transport co-operative', pct: 10, color: '#f0a03a' },
  { label: 'Retailer', pct: 25, color: '#8e5bbf' },
  { label: 'Community fund', pct: 5, color: '#e06a8a' },
  { label: 'Company', pct: 10, color: '#9aa0a6' }
];

function buildStimulus(cellId) {
  const cell = CELLS[cellId];
  if (!cell) return '';
  const isTech = cell.frame === 0;
  const hasCo = cell.cobrand === 1;

  // Middle content block - the only part that varies by FRAME.
  let middle;
  if (isTech) {
    const checks = STAGES.map(
      (s) => `<div class="check"><span class="tick">&#10003;</span>${s}: verified</div>`
    ).join('');
    middle = `
      <div class="stage-grid">${checks}</div>
      <p class="stim-line">This record confirms that the product is genuine and has not been substituted or relabelled at any stage.</p>`;
  } else {
    const bar = SHARES.map(
      (s) => `<div class="seg" style="width:${s.pct}%;background:${s.color}" title="${s.label} \u2014 ${s.pct}%"></div>`
    ).join('');
    const legend = SHARES.map(
      (s) => `<div class="lg"><span class="dot" style="background:${s.color}"></span>${s.label} \u2014 ${s.pct}%</div>`
    ).join('');
    middle = `
      <div class="share-bar">${bar}</div>
      <div class="share-legend">${legend}</div>
      <p class="stim-line">This record shows how the price you pay is shared among the people involved at each stage.</p>`;
  }

  // Certification block - the only part that varies by COBRAND.
  const cobrand = hasCo
    ? `<p class="stim-line co-brand-line">The brand behind this product is FSSAI-licensed and AGMARK-certified.</p>
       <div class="cobrand-row">
         <img class="cobrand-logo" src="logos/fssai.png" alt="FSSAI mark" title="FSSAI mark" />
         <img class="cobrand-logo" src="logos/agmark.png" alt="AGMARK mark" title="AGMARK mark" />
       </div>`
    : '';

  return `
    <div class="phone-card">
      <div class="card-head">
        <span class="head-icon">&#128196;</span>
        <span class="head-title">VERIFIED PRODUCT RECORD</span>
      </div>
      <p class="stim-line">${SHARED_OPEN}</p>
      ${middle}
      ${cobrand}
      <p class="stim-line">${SHARED_CLOSE}</p>
      <div class="ver-id">Verification ID: TX-4471</div>
    </div>`;
}

function renderStimulus(cellId, container) {
  container.innerHTML = buildStimulus(cellId);
}

// Expose for browser use.
if (typeof window !== 'undefined') {
  window.CELLS = CELLS;
  window.MC_CORRECT = MC_CORRECT;
  window.renderStimulus = renderStimulus;
}

// Expose for Node use (tests).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CELLS, MC_CORRECT, buildStimulus, renderStimulus };
}
