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

// Correct answers to the Section H checks per cell.
//   mc_a: 'a' = price sharing (beneficiary) | 'b' = stages checked (technical)
//   mc_b: marks shown only in co-brand cells.
//   psa6: manipulation strength, beneficiary direction (high in cells 3-4).
//   psa7: manipulation strength, technical direction (high in cells 1-2).
const MC_CORRECT = {
  1: { mc_a: 'b', mc_b: 'No', psa6: 'Low', psa7: 'High' },
  2: { mc_a: 'b', mc_b: 'Yes', psa6: 'Low', psa7: 'High' },
  3: { mc_a: 'a', mc_b: 'No', psa6: 'High', psa7: 'Low' },
  4: { mc_a: 'a', mc_b: 'Yes', psa6: 'High', psa7: 'Low' }
};

// ---------------------------------------------------------------------------
// Stimulus architecture (v3.3): all four versions share an identical header,
// an identical opening sentence, an identical closing tamper-resistance
// sentence and an identical Verification ID. Only the middle content block
// varies by FRAME, and only the certification block varies by COBRAND. Both
// middle blocks list six entities so visual density matches, and each block
// carries one descriptive line of matching length (within 5% word count).
//
// v3.3 removed the technical-only authenticity sentence ("genuine ... not
// substituted or relabelled"): a security/authenticity assurance present in one
// framing only would confound FRAME with the presence of a guarantee, and Paper
// 2 found safety and authenticity to dominate beneficiary purchase criteria.
// The header is now identical across cells (plan Section 9.1); the earlier
// frame-aware title was a second framing cue.
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

  // Middle content block - the only part that varies by FRAME. Both branches
  // list six entities, carry one descriptive line of matching length, and make
  // no security or authenticity claim that the other does not make.
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
      (s) => `<div class="lg"><span class="dot" style="background:${s.color}"></span>${t(s.key)} (${s.pct}%)</div>`
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
        <span class="head-title">${t('stim.head.product')}</span>
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
