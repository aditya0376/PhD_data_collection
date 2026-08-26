'use strict';

// ---------------------------------------------------------------------------
// The four experimental cells (2x2: FRAME x COBRAND).
//   frame  0 = Technical, 1 = Beneficiary
//   cobrand 0 = Absent,   1 = Present (FSSAI + AGMARK marks)
// ---------------------------------------------------------------------------
const CELLS = {
  1: { frame: 0, cobrand: 0, name: 'Technical · No Co-brand', theme: 'technical' },
  2: { frame: 0, cobrand: 1, name: 'Technical · Co-brand',    theme: 'technical' },
  3: { frame: 1, cobrand: 0, name: 'Beneficiary · No Co-brand', theme: 'beneficiary' },
  4: { frame: 1, cobrand: 1, name: 'Beneficiary · Co-brand',  theme: 'beneficiary' }
};

// Correct answers to the manipulation checks, per cell (used by the admin
// preview page to verify each version is wired correctly).
const MC_CORRECT = {
  1: { mc_a: 'b', mc_b: 'No' },   // technical -> tamper-resistant; no marks
  2: { mc_a: 'b', mc_b: 'Yes' },  // technical -> tamper-resistant; marks present
  3: { mc_a: 'a', mc_b: 'No' },   // beneficiary -> price sharing; no marks
  4: { mc_a: 'a', mc_b: 'Yes' }   // beneficiary -> price sharing; marks present
};

// ---------------------------------------------------------------------------
// Build the stimulus DOM for a given cell.
// The card chrome/layout is identical across cells (matched length & density);
// only the manipulated content differs, and it is made visually significant so
// the control (technical) vs. impact (beneficiary) difference is felt.
// ---------------------------------------------------------------------------
function renderStimulus(cellId, container) {
  const cell = CELLS[cellId];
  if (!cell) return;

  const isTech = cell.theme === 'technical';
  const hasCo = cell.cobrand === 1;

  const coBrandHtml = hasCo
    ? `<div class="cobrand-row">
         <img class="cobrand-logo" src="logos/fssai.png" alt="FSSAI mark" title="FSSAI mark" />
         <img class="cobrand-logo" src="logos/agmark.png" alt="AGMARK mark" title="AGMARK mark" />
       </div>`
    : '';

  let bodyHtml;
  if (isTech) {
    bodyHtml = `
      <p class="stim-line">Every step of this product's journey - from farm to shelf - is stored in a secure digital record that cannot be changed once entered.</p>
      <div class="tech-checks">
        <div class="check"><span class="tick">&#10003;</span> Harvest: verified</div>
        <div class="check"><span class="tick">&#10003;</span> Processing: verified</div>
        <div class="check"><span class="tick">&#10003;</span> Packaging: verified</div>
        <div class="check"><span class="tick">&#10003;</span> Transport: verified</div>
      </div>
      <p class="stim-line">This record is tamper-resistant. It confirms that the product is genuine and has not been substituted or relabelled at any stage.</p>`;
  } else {
    bodyHtml = `
      <p class="stim-line">Every step of this product's journey - from farm to shelf - is recorded, including how the price you pay is shared among the people involved.</p>
      <div class="share-bar">
        <div class="seg" style="width:30%;background:#2e9e5b" title="Farmer (Golaghat) 30%"></div>
        <div class="seg" style="width:20%;background:#3b82c4" title="Processing unit 20%"></div>
        <div class="seg" style="width:10%;background:#f0a03a" title="Transport co-operative 10%"></div>
        <div class="seg" style="width:25%;background:#8e5bbf" title="Retailer 25%"></div>
        <div class="seg" style="width:5%;background:#e06a8a" title="Community fund 5%"></div>
        <div class="seg" style="width:10%;background:#9aa0a6" title="Company 10%"></div>
      </div>
      <div class="share-legend">
        <div class="lg"><span class="dot" style="background:#2e9e5b"></span>Farmer (Golaghat) 30%</div>
        <div class="lg"><span class="dot" style="background:#3b82c4"></span>Processing unit 20%</div>
        <div class="lg"><span class="dot" style="background:#f0a03a"></span>Transport co-operative 10%</div>
        <div class="lg"><span class="dot" style="background:#8e5bbf"></span>Retailer 25%</div>
        <div class="lg"><span class="dot" style="background:#e06a8a"></span>Community fund 5%</div>
        <div class="lg"><span class="dot" style="background:#9aa0a6"></span>Company 10%</div>
      </div>
      <p class="stim-line">This record shows who earned what from your purchase.</p>`;
  }

  const coBrandLine = hasCo
    ? `<p class="stim-line co-brand-line">The brand behind this product is FSSAI-licensed and AGMARK-certified.</p>`
    : '';

  container.innerHTML = `
    <div class="phone-card ${cell.theme}">
      <div class="card-head">
        <span class="head-icon">${isTech ? '&#128737;' : '&#128176;'}</span>
        <span class="head-title">${isTech ? 'VERIFIED PRODUCT RECORD' : 'VERIFIED VALUE RECORD'}</span>
      </div>
      ${bodyHtml}
      ${coBrandLine}
      ${coBrandHtml}
      <div class="ver-id">Verification ID: TX-4471</div>
    </div>`;
}

// Expose for browser use.
if (typeof window !== 'undefined') {
  window.CELLS = CELLS;
  window.MC_CORRECT = MC_CORRECT;
  window.renderStimulus = renderStimulus;
}

// Expose for Node use (tests).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CELLS, MC_CORRECT, renderStimulus };
}