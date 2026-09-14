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
//
// All text is pulled through the i18n layer (t()) so the stimulus renders in
// the participant's chosen language. The card title is frame-aware: technical
// cells show "VERIFIED PRODUCT RECORD", beneficiary cells show "VERIFIED
// VALUE RECORD" (per the design protocol §2).
// ---------------------------------------------------------------------------
const STAGE_KEYS = ['stage.harvest', 'stage.processing', 'stage.packaging', 'stage.storage', 'stage.transport', 'stage.retail'];

const SHARES = [
  { key: 'share.farmer', pct: 30, color: '#2e9e5b' },
  { key: 'share.processing', pct: 20, color: '#3b82c4' },
  { key: 'share.transport', pct: 10, color: '#f0a03a' },
  { key: 'share.retailer', pct: 25, color: '#8e5bbf' },
  { key: 'share.community', pct: 5, color: '#e06a8a' },
  { key: 'share.company', pct: 10, color: '#9aa0a6' }
];

function buildStimulus(cellId) {
  const cell = CELLS[cellId];
  if (!cell) return '';
  const isTech = cell.frame === 0;
  const hasCo = cell.cobrand === 1;

  // Middle content block - the only part that varies by FRAME.
  let middle;
  if (isTech) {
    const checks = STAGE_KEYS.map(
      (k) => `<div class="check"><span class="tick">&#10003;</span>${t(k)}: ${t('stim.verified')}</div>`
    ).join('');
    middle = `
      <div class="stage-grid">${checks}</div>
      <p class="stim-line">${t('stim.techLine')}</p>`;
  } else {
    const bar = SHARES.map(
      (s) => `<div class="seg" style="width:${s.pct}%;background:${s.color}" title="${t(s.key)} \u2014 ${s.pct}%"></div>`
    ).join('');
    const legend = SHARES.map(
      (s) => `<div class="lg"><span class="dot" style="background:${s.color}"></span>${t(s.key)} \u2014 ${s.pct}%</div>`
    ).join('');
    middle = `
      <div class="share-bar">${bar}</div>
      <div class="share-legend">${legend}</div>
      <p class="stim-line">${t('stim.benLine')}</p>`;
  }

  // Certification block - the only part that varies by COBRAND.
  const cobrand = hasCo
    ? `<p class="stim-line co-brand-line">${t('stim.coBrandLine')}</p>
       <div class="cobrand-row">
         <img class="cobrand-logo" src="logos/fssai.png" alt="FSSAI mark" title="FSSAI mark" />
         <img class="cobrand-logo" src="logos/agmark.png" alt="AGMARK mark" title="AGMARK mark" />
       </div>`
    : '';

  return `
    <div class="phone-card">
      <div class="card-head">
        <span class="head-icon">&#128196;</span>
        <span class="head-title">${t(isTech ? 'stim.head.product' : 'stim.head.value')}</span>
      </div>
      <p class="stim-line">${t('stim.sharedOpen')}</p>
      ${middle}
      ${cobrand}
      <p class="stim-line">${t('stim.sharedClose')}</p>
      <div class="ver-id">${t('stim.verId')}</div>
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
