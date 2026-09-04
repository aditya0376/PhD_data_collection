'use strict';

// ---------------------------------------------------------------------------
// Paper 3 instrument, Version 3.2 (TAM3). 67 Likert items in total:
//   B block: PEC(3) GDS(3) TPR(3) MV(3)                          = 12
//   C block: DVC(4) AC1(1) SAF(4)                                =  9
//   E block: PSA(6) TP(6) PF(3) PSI(5)                           = 20
//   F block: PU(4) PEOU(4) ITU(3) PE(3) SN(3) AC2(1)             = 18
//   G block: PI(4) RES(4)                                        =  8
// 5-point Likert: 1 = Strongly disagree ... 5 = Strongly agree
// SAF2 is reverse-coded at analysis; no (R) marker is shown to respondents.
// ---------------------------------------------------------------------------

// Section B - B12 Perceptions of external control (digital access)
const PEC_ITEMS = [
  { n: 'pec1', t: 'I have a phone that can scan codes on product packages.' },
  { n: 'pec2', t: 'I usually have enough mobile network or data to check a product while I am shopping.' },
  { n: 'pec3', t: 'The shops where I buy things for my child have good enough network for this to work.' }
];

// Section B - B13 General digital self-efficacy
const GDS_ITEMS = [
  { n: 'gds1', t: 'I am confident using my smartphone for most things I need to do.' },
  { n: 'gds2', t: 'I can usually work out how to use a new app on my own.' },
  { n: 'gds3', t: 'I would describe myself as good with digital technology.' }
];

// Section B - B14 Situational constraints (time pressure)
const TPR_ITEMS = [
  { n: 'tpr1', t: 'I am usually in a hurry when I shop for my family.' },
  { n: 'tpr2', t: 'I often shop with my children with me, which makes it harder to take time over choices.' },
  { n: 'tpr3', t: 'I rarely have time to compare products carefully in the shop.' }
];

// Section B - B15 Marker variable (theoretically unrelated, CFA marker technique)
const MV_ITEMS = [
  { n: 'mv1', t: 'I prefer to plan my day in advance rather than decide as I go.' },
  { n: 'mv2', t: 'I enjoy trying food I have never eaten before.' },
  { n: 'mv3', t: 'I would rather spend a free evening at home than go out.' }
];

// Section C - C1 Digital verification self-efficacy
const DVC_ITEMS = [
  { n: 'dvc1', t: 'I am confident I could scan a code on a product package if I wanted to.' },
  { n: 'dvc2', t: 'I would know what to do with the screen that appears after scanning a code.' },
  { n: 'dvc3', t: 'I could work out for myself whether the information shown after scanning is worth trusting.' },
  { n: 'dvc4', t: 'I have the skills needed to check products digitally when I shop.' }
];

// Section C - C2 Attention check (instructed response: select 2)
const AC1_ITEM = [
  { n: 'ac1', t: 'This is a check to confirm you are reading carefully. Please select "Disagree" (2) for this statement.' }
];

// Section C - C3 Concern for child product safety
const SAF_ITEMS = [
  { n: 'saf1', t: 'I would switch to a different brand if I learned it was safer for my child.' },
  { n: 'saf2', t: 'I sometimes buy products for my child without checking the label.' },
  { n: 'saf3', t: 'I have refused to buy a product for my child because I was unsure it was genuine.' },
  { n: 'saf4', t: 'I check where a children\u2019s product came from before buying it.' }
];

// Section E - E1 Perceived signal accessibility (PSA5/PSA6 are
// manipulation-strength checks, analysed separately, still collected here)
const PSA_ITEMS = [
  { n: 'psa1', t: 'The information tells me enough about how this product reached the shop.' },
  { n: 'psa2', t: 'It is clear to me what this record is telling me about the product.' },
  { n: 'psa3', t: 'The information appears accurate and complete.' },
  { n: 'psa4', t: 'Overall, this record makes the product\u2019s journey visible to me.' },
  { n: 'psa5', t: 'I can identify the different people or groups involved in making this product.' },
  { n: 'psa6', t: 'I can tell what each of them receives from the price I pay.' }
];

// Section E - E2 Trust in the product source
const TP_ITEMS = [
  { n: 'tp1', t: 'I believe the people behind this product are capable of doing what they claim.' },
  { n: 'tp2', t: 'The assurances given about this product are reliable.' },
  { n: 'tp3', t: 'I believe the information given about this product is honest.' },
  { n: 'tp4', t: 'Those responsible for this product would act in my child\u2019s best interest.' },
  { n: 'tp5', t: 'I can depend on this product being what it says it is.' },
  { n: 'tp6', t: 'The claims made about this product are sincere.' }
];

// Section E - E3 Perceived fairness (worded to be answerable in all four cells)
const PF_ITEMS = [
  { n: 'pf1', t: 'This product seems to be produced in a way that treats people fairly.' },
  { n: 'pf2', t: 'The people who produced this product are probably paid reasonably.' },
  { n: 'pf3', t: 'I feel this product\u2019s supply chain is fair to the people working in it.' }
];

// Section E - E4 Perceived social impact (outcome belief, NOT social influence)
const PSI_ITEMS = [
  { n: 'psi1', t: 'Buying products like this can help improve the lives of the people who produce them.' },
  { n: 'psi2', t: 'My buying choices can help reduce poverty among small producers.' },
  { n: 'psi3', t: 'Buying products like this supports fair wages and decent working conditions.' },
  { n: 'psi4', t: 'People like me can make a difference to society through what we buy.' },
  { n: 'psi5', t: 'When I buy products like this, I feel my purchase does some good.' }
];

// Section F - acceptance of the verification technology (TAM3)
const PU_ITEMS = [
  { n: 'pu1', t: 'Using this digital verification helps me make a better buying decision for my child.' },
  { n: 'pu2', t: 'The information I get from scanning the code is useful to me.' },
  { n: 'pu3', t: 'Checking products this way improves the quality of my purchase decision.' },
  { n: 'pu4', t: 'Overall, I find checking products this way useful.' }
];

const PEOU_ITEMS = [
  { n: 'peou1', t: 'Learning to check a product this way would be easy for me.' },
  { n: 'peou2', t: 'I would find it easy to scan and check a product.' },
  { n: 'peou3', t: 'Checking a product this way is clear and understandable.' },
  { n: 'peou4', t: 'Overall, I would find checking products this way easy to use.' }
];

const ITU_ITEMS = [
  { n: 'itu1', t: 'I intend to scan and check products this way when I shop for my child.' },
  { n: 'itu2', t: 'I will try to check products this way in future.' },
  { n: 'itu3', t: 'I plan to use this way of checking products when it is available.' }
];

const PE_ITEMS = [
  { n: 'pe1', t: 'I find the idea of checking products this way interesting.' },
  { n: 'pe2', t: 'Checking products this way would be enjoyable.' },
  { n: 'pe3', t: 'I would find the process of scanning and checking a product pleasant.' }
];

const SN_ITEMS = [
  { n: 'sn1', t: 'People who are important to me would think I should check products this way.' },
  { n: 'sn2', t: 'People whose opinions I value would want me to check products this way.' },
  { n: 'sn3', t: 'My family would expect me to check products this way when buying for my child.' }
];

// Section F - F6 Attention check (instructed response: select 5)
const AC2_ITEM = [
  { n: 'ac2', t: 'Please select "Strongly agree" (5) for this statement so that we know you are reading carefully.' }
];

// Section G - G1 Purchase intention
const PI_ITEMS = [
  { n: 'pi1', t: 'I would consider buying this product, as described in the information shown earlier, for my child.' },
  { n: 'pi2', t: 'I am likely to purchase this product, as described in the information shown earlier.' },
  { n: 'pi3', t: 'I would choose this product, as described in the information shown earlier, over a similar product without this information.' },
  { n: 'pi4', t: 'I intend to buy this product, as described in the information shown earlier, the next time I shop for my child.' }
];

// Section G - G2 Resistance beliefs (asked of ALL respondents)
const RES_ITEMS = [
  { n: 'res1', t: 'I could not afford to pay extra for a product like this.' },
  { n: 'res2', t: 'Checking products this way is not something I would do.' },
  { n: 'res3', t: 'Honesty should not cost the customer extra \u2014 it is the government\u2019s job to ensure it.' },
  { n: 'res4', t: 'I already trust the brands I buy, so I do not need this information.' }
];

// ---------------------------------------------------------------------------
// Build Likert grids
// ---------------------------------------------------------------------------
function likertGrid(items, containerId) {
  const el = document.getElementById(containerId);
  let html = '';
  for (const it of items) {
    html += `<div class="item"><p class="q">${it.t}</p><div class="likert">`;
    for (let v = 1; v <= 5; v++) {
      html += `<label class="lk"><input type="radio" name="${it.n}" value="${v}" /><span>${v}</span></label>`;
    }
    html += `</div><div class="lk-labels"><span>Strongly disagree</span><span>Strongly agree</span></div></div>`;
  }
  el.innerHTML = html;
}

// ---------------------------------------------------------------------------
// Step navigation
// ---------------------------------------------------------------------------
let startTime = Date.now();
let assignedCell = null;

const STEP_ORDER = [
  's-consent', 's-b1', 's-demo', 's-habits', 's-c',
  's-stimulus', 's-e', 's-f', 's-g', 's-h', 's-done'
];
const STEP_LABELS = {
  's-consent': 'Consent',
  's-b1': 'About you',
  's-demo': 'About you',
  's-habits': 'Shopping and digital habits',
  's-c': 'Your views',
  's-stimulus': 'Product scenario',
  's-e': 'Your reactions',
  's-f': 'The checking technology',
  's-g': 'Your decision',
  's-h': 'Thank you',
  's-done': 'Done'
};

function show(id) {
  document.querySelectorAll('.step').forEach((s) => (s.style.display = 'none'));
  document.getElementById(id).style.display = 'block';
  window.scrollTo(0, 0);
  updateProgress(id);
}

function updateProgress(id) {
  const idx = STEP_ORDER.indexOf(id);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  if (fill) {
    // Completion screens (done / thank-you) show a full bar.
    const pct = (id === 's-done' || id === 's-thankyou') ? 100 : Math.round(((idx + 1) / STEP_ORDER.length) * 100);
    fill.style.width = pct + '%';
  }
  if (label) label.textContent = STEP_LABELS[id] || '';
}

function go(id) {
  if (!validateStep(id)) return;
  show(id);
}

function validateStep(nextId) {
  // Validate the CURRENT visible step before moving on.
  const current = document.querySelector('.step[style*="block"]') ||
    document.querySelector('.step:not([style])');
  const stepId = current ? current.id : null;

  if (stepId === 's-consent') {
    if (!document.getElementById('consentBox').checked) {
      alert('Please tick the consent box to continue.');
      return false;
    }
    return true;
  }

  if (stepId === 's-b1') {
    if (!radioVal('b1')) { alert('Please answer B1.'); return false; }
    return true;
  }

  // For all other steps, require every VISIBLE radio group to be answered
  // (hidden groups, e.g. G4 when G3 != Nothing, are not required).
  const radios = Array.from(current.querySelectorAll('input[type="radio"]'))
    .filter((r) => r.offsetParent !== null || isInVisibleWrap(r));
  const groups = {};
  radios.forEach((r) => { groups[r.name] = true; });
  for (const name of Object.keys(groups)) {
    if (!radioVal(name)) { alert('Please answer every question before continuing.'); return false; }
  }

  // Required number/text inputs (B7, B8 age bands) in the demographics step.
  const requiredText = Array.from(current.querySelectorAll('input[type="text"], input[type="number"]'))
    .filter((r) => r.offsetParent !== null || isInVisibleWrap(r));
  for (const inp of requiredText) {
    if (inp.value.trim() === '') { alert('Please answer every question before continuing. Enter 0 if none.'); return false; }
  }

  return true;
}

function isInVisibleWrap(el) {
  // offsetParent is null for fixed-position ancestors; fall back to walking up.
  let node = el;
  while (node && node !== document.body) {
    if (getComputedStyle(node).display === 'none') return false;
    node = node.parentElement;
  }
  return true;
}

function radioVal(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}

function checkB1() {
  if (!radioVal('b1')) { alert('Please answer B1.'); return; }
  if (radioVal('b1') === '0') { show('s-thankyou'); return; }
  show('s-demo');
}

// ---------------------------------------------------------------------------
// Randomization (server-side assignment, cached in localStorage)
// ---------------------------------------------------------------------------
async function ensureCell() {
  const cached = localStorage.getItem('p3_cell');
  if (cached) { assignedCell = parseInt(cached, 10); return; }
  const res = await fetch('/api/assign');
  const data = await res.json();
  assignedCell = data.cell;
  localStorage.setItem('p3_cell', String(assignedCell));
}

// ---------------------------------------------------------------------------
// Submit
// ---------------------------------------------------------------------------
async function submitSurvey() {
  if (!validateStep('s-h')) return;

  const payload = { cell_id: assignedCell };
  const cell = window.CELLS[assignedCell];
  payload.frame = cell.frame;
  payload.cobrand = cell.cobrand;
  payload.completion_time_sec = Math.round((Date.now() - startTime) / 1000);

  // All radio groups
  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    if (r.checked) payload[r.name] = r.value;
  });

  // Text, number and email inputs
  document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"]').forEach((r) => {
    payload[r.name] = r.value.trim();
  });

  // Open-ended textareas (G4 conditional, G5 always)
  document.querySelectorAll('textarea').forEach((r) => {
    payload[r.name] = r.value.trim();
  });

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.ok) {
      localStorage.removeItem('p3_cell');
      show('s-done');
    } else {
      alert('There was a problem saving your response. Please try again.');
    }
  } catch (err) {
    alert('Network error. Please check your connection and try again.');
  }
}

// ---------------------------------------------------------------------------
// Reset - allow submitting another response
// ---------------------------------------------------------------------------
async function resetSurvey() {
  // Clear all form inputs
  document.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
  document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"]').forEach((r) => (r.value = ''));
  document.querySelectorAll('textarea').forEach((r) => (r.value = ''));
  document.getElementById('consentBox').checked = false;
  document.getElementById('g4-wrap').style.display = 'none';

  // Clear the old cell assignment and get a fresh one
  localStorage.removeItem('p3_cell');
  assignedCell = null;
  await ensureCell();
  renderStimulus(assignedCell, document.getElementById('stimulus'));

  // Restart the timer for the new response
  startTime = Date.now();

  show('s-consent');
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  // Section B (B12-B15)
  likertGrid(PEC_ITEMS, 'pec-items');
  likertGrid(GDS_ITEMS, 'gds-items');
  likertGrid(TPR_ITEMS, 'tpr-items');
  likertGrid(MV_ITEMS, 'mv-items');
  // Section C
  likertGrid(DVC_ITEMS, 'dvc-items');
  likertGrid(AC1_ITEM, 'ac1-items');
  likertGrid(SAF_ITEMS, 'saf-items');
  // Section E
  likertGrid(PSA_ITEMS, 'psa-items');
  likertGrid(TP_ITEMS, 'tp-items');
  likertGrid(PF_ITEMS, 'pf-items');
  likertGrid(PSI_ITEMS, 'psi-items');
  // Section F
  likertGrid(PU_ITEMS, 'pu-items');
  likertGrid(PEOU_ITEMS, 'peou-items');
  likertGrid(ITU_ITEMS, 'itu-items');
  likertGrid(PE_ITEMS, 'pe-items');
  likertGrid(SN_ITEMS, 'sn-items');
  likertGrid(AC2_ITEM, 'ac2-items');
  // Section G
  likertGrid(PI_ITEMS, 'pi-items');
  likertGrid(RES_ITEMS, 'res-items');

  await ensureCell();
  renderStimulus(assignedCell, document.getElementById('stimulus'));

  // Show G4 (open reason) only when G3 WTP = Nothing
  document.querySelectorAll('input[name="g3_wtp"]').forEach((r) => {
    r.addEventListener('change', () => {
      document.getElementById('g4-wrap').style.display = (radioVal('g3_wtp') === '0') ? 'block' : 'none';
    });
  });

  show('s-consent');
});
