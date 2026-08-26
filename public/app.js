'use strict';

// ---------------------------------------------------------------------------
// Item banks (5-point Likert: 1 = Strongly disagree ... 5 = Strongly agree)
// ---------------------------------------------------------------------------
const LIKERT = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

const C_ITEMS = [
  { n: 'ba1', t: 'I can find reliable information about blockchain technology when I want to.' },
  { n: 'ba2', t: 'I can judge whether information I read about blockchain technology is accurate.' },
  { n: 'ba3', t: 'I understand the economic uses that blockchain technology can have.' },
  { n: 'ba4', t: 'I am aware that rules and regulations apply to how blockchain technology is used.' },
  { n: 'ba5', t: 'I am aware of the risks (such as fraud or misuse) associated with blockchain technology.' },
  { n: 'ba6', t: 'Overall, I have a good understanding of what blockchain technology is.' },
  { n: 'dvc1', t: 'I am confident I could scan a code on a product package if I wanted to.' },
  { n: 'dvc2', t: 'I would know what to do with the screen that appears after scanning a code.' },
  { n: 'dvc3', t: 'I could work out for myself whether the information shown after scanning is worth trusting.' },
  { n: 'dvc4', t: 'Checking a product this way would be easy for me.' },
  { n: 'dvc5', t: 'I would need someone else\'s help to check a product this way.' },
  { n: 'dvc6', t: 'I have enough knowledge and ability to check products digitally when I shop.' },
  { n: 'ac1', t: 'This is a check to confirm you are reading carefully. Please select "Disagree" (2) for this statement.' },
  { n: 'saf1', t: 'When buying products for my child, safety matters more to me than anything else.' },
  { n: 'saf2', t: 'I worry about whether the products I buy for my child are genuine.' },
  { n: 'saf3', t: 'I read labels carefully before buying products for my child.' }
];

const E_ITEMS = [
  { n: 'vat1', t: 'The information tells me enough about how this product reached the shop.' },
  { n: 'vat2', t: 'The information shown is easy for me to understand.' },
  { n: 'vat3', t: 'The information appears accurate and complete.' },
  { n: 'vat4', t: 'I can identify the different people or groups involved in making this product.' },
  { n: 'vat5', t: 'I can tell what each of them receives from the price I pay.' },
  { n: 'vat6', t: 'Overall, this product\'s journey is visible to me.' },
  { n: 'tp1', t: 'I believe the people behind this product are capable of doing what they claim.' },
  { n: 'tp2', t: 'The verification shown is reliable.' },
  { n: 'tp3', t: 'I believe the information given about this product is honest.' },
  { n: 'tp4', t: 'Those responsible for this product would act in my child\'s best interest.' },
  { n: 'tp5', t: 'I can depend on this product being what it says it is.' },
  { n: 'tp6', t: 'The claims made about this product are sincere.' },
  { n: 'ac2', t: 'Please select "Strongly agree" (5) for this statement so that we know you are reading carefully.' },
  { n: 'psi1', t: 'Buying products like this can help improve the lives of the people who produce them.' },
  { n: 'psi2', t: 'My buying choices can help reduce poverty among small producers.' },
  { n: 'psi3', t: 'Buying products like this supports fair wages and decent working conditions.' },
  { n: 'psi4', t: 'People like me can make a difference to society through what we buy.' },
  { n: 'psi5', t: 'When I buy products like this, I feel my purchase does some good.' }
];

const F_ITEMS = [
  { n: 'pi1', t: 'I would consider buying this product for my child.' },
  { n: 'pi2', t: 'I am likely to purchase this product.' },
  { n: 'pi3', t: 'The chance that I would buy this product is high.' },
  { n: 'pi4', t: 'I would choose this product over a similar product without this information.' },
  { n: 'pi5', t: 'I intend to buy this product the next time I shop for my child.' }
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

const STEP_ORDER = ['s-consent', 's-b1', 's-demo', 's-c', 's-stimulus', 's-e', 's-f', 's-done'];
const STEP_LABELS = {
  's-consent': 'Consent', 's-b1': 'About you', 's-demo': 'About you',
  's-c': 'Your views', 's-stimulus': 'Product scenario', 's-e': 'Your reactions',
  's-f': 'Your decision', 's-done': 'Done'
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
  // (hidden groups, e.g. F2 when F1 != Nothing, are not required).
  const radios = Array.from(current.querySelectorAll('input[type="radio"]'))
    .filter((r) => r.offsetParent !== null || isInVisibleWrap(r));
  const groups = {};
  radios.forEach((r) => { groups[r.name] = true; });
  for (const name of Object.keys(groups)) {
    if (!radioVal(name)) { alert('Please answer every question before continuing.'); return false; }
  }

  // Required text/number inputs (B7, B8) in the demographics step.
  const requiredText = Array.from(current.querySelectorAll('input[type="text"], input[type="number"]'))
    .filter((r) => r.offsetParent !== null || isInVisibleWrap(r));
  for (const inp of requiredText) {
    if (!inp.value.trim()) { alert('Please answer every question before continuing.'); return false; }
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
  if (!validateStep('s-f')) return;

  const payload = { cell_id: assignedCell };
  const cell = window.CELLS[assignedCell];
  payload.frame = cell.frame;
  payload.cobrand = cell.cobrand;
  payload.completion_time_sec = Math.round((Date.now() - startTime) / 1000);

  // All radio groups
  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    if (r.checked) payload[r.name] = r.value;
  });

  // Text inputs
  document.querySelectorAll('input[type="text"], input[type="number"]').forEach((r) => {
    payload[r.name] = r.value.trim();
  });
  const comment = document.querySelector('textarea[name="f3_comment"]');
  if (comment) payload.f3_comment = comment.value.trim();
  const email = document.querySelector('input[name="email"]');
  if (email) payload.email = email.value.trim();

  // F2 shown only when F1 = Nothing
  if (payload.f1_wtp === '0') {
    document.getElementById('f2-wrap').style.display = 'block';
    if (!radioVal('f2_reason')) { alert('Please answer F2.'); return; }
  }

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
  document.getElementById('f2-wrap').style.display = 'none';

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
  likertGrid(C_ITEMS, 'c-items');
  likertGrid(E_ITEMS, 'e-items');
  likertGrid(F_ITEMS, 'f-items');
  await ensureCell();
  renderStimulus(assignedCell, document.getElementById('stimulus'));

  // Show F2 when F1 = Nothing
  document.querySelectorAll('input[name="f1_wtp"]').forEach((r) => {
    r.addEventListener('change', () => {
      document.getElementById('f2-wrap').style.display = (radioVal('f1_wtp') === '0') ? 'block' : 'none';
    });
  });

  show('s-consent');
});