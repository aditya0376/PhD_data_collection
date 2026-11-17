'use strict';

// ---------------------------------------------------------------------------
// Paper 3 instrument, Version 3.4 (TAM3), per Paper3_Objectives_Analysis v2.4
// and Paper3_Questionnaire v3.4.
//
// 41 Likert items in total:
//   B block: PEC(2) MV(3)                                        =  5
//   C block: DVC(4) AC1(1) SAF(2)                                =  7
//   E block: PSA(4) PSA6/PSA7(2, manipulation strength) TP(4) PF(3) = 13
//   F block: PU(3) PEOU(3) ITU(3) AC2(1)                         = 10
//   G block: PI(3) RES(3)                                        =  6
// plus demographic questions B1, B2, B3, B4, B6, B8, B9, B10.
//
// Item codes are kept from earlier versions so the data file stays comparable,
// which leaves intentional gaps (PU3, PEOU3, PI1, RES2, SAF1/2, PSA5).
// PSA1-PSA4 enter the latent construct. PSA6 and PSA7 are manipulation-strength
// checks (beneficiary and technical direction) and must never be scored as PSA.
//
// 5-point Likert: 1 = Strongly disagree ... 5 = Strongly agree
// Each item carries both languages: `en` and `as` (Assamese, currently DRAFT -
// see TRANSLATION_TODO.md and the i18n.js header).
// ---------------------------------------------------------------------------

// Section B - B12 Perceptions of external control (digital access)
const PEC_ITEMS = [
  { n: 'pec1', en: 'I have a phone that can scan codes on product packages.', as: 'মোৰ হাতত এনে এটা ফোন আছে যিটোৰে পণ্যৰ বাকচত থকা কোড স্কেন কৰিব পাৰি।' },
  { n: 'pec2', en: 'I usually have enough mobile network or data to check a product while I am shopping.', as: 'কিনাকিনি কৰি থকা সময়ত পণ্য পৰীক্ষা কৰিবলৈ সাধাৰণতে মোৰ যথেষ্ট মোবাইল নেটৱৰ্ক বা ডেটা থাকে।' }
];

// Section B - B15 Marker variable (theoretically unrelated, CFA marker technique)
const MV_ITEMS = [
  { n: 'mv1', en: 'I prefer to plan my day in advance rather than decide as I go.', as: 'যেতিয়াই যাওঁ তেতিয়াই ঠিক কৰাতকৈ মই দিনটো আগতীয়াকৈ পৰিকল্পনা কৰিবলৈ ভাল পাওঁ।' },
  { n: 'mv2', en: 'I enjoy trying food I have never eaten before.', as: 'আগতে কেতিয়াও নোখোৱা খাদ্য চেষ্টা কৰিবলৈ মই ভাল পাওঁ।' },
  { n: 'mv3', en: 'I would rather spend a free evening at home than go out.', as: 'বাহিৰলৈ যোৱাতকৈ মই ঘৰতে মুক্ত সন্ধিয়া কটাবলৈহে ভাল পাওঁ।' }
];

// Section C - C1 Digital verification self-efficacy
const DVC_ITEMS = [
  { n: 'dvc1', en: 'I am confident I could scan a code on a product package if I wanted to.', as: 'ইচ্ছা কৰিলে পণ্যৰ বাকচত থকা কোড স্কেন কৰিব পাৰিম বুলি মই আত্মবিশ্বাসী।' },
  { n: 'dvc2', en: 'I would know what to do with the screen that appears after scanning a code.', as: 'কোড স্কেন কৰাৰ পিছত ওলোৱা স্ক্ৰীনটোৰ সৈতে কি কৰিব লাগে মই জানিম।' },
  { n: 'dvc3', en: 'I could work out for myself whether the information shown after scanning is worth trusting.', as: 'স্কেন কৰাৰ পিছত দেখুওৱা তথ্য বিশ্বাসযোগ্য হয় নে নহয় মই নিজেই বুজি পাব পাৰিম।' },
  { n: 'dvc4', en: 'I have the skills needed to check products digitally when I shop.', as: 'কিনাকিনি কৰোঁতে ডিজিটেলভাৱে পণ্য পৰীক্ষা কৰিবলৈ প্ৰয়োজনীয় দক্ষতা মোৰ আছে।' }
];

// Section C - C2 Attention check (instructed response: select 2)
const AC1_ITEM = [
  { n: 'ac1', en: 'This is a check to confirm you are reading carefully. Please select "Disagree" (2) for this statement.', as: 'আপুনি মনোযোগেৰে পঢ়ি আছে নে নাই পৰীক্ষা কৰিবলৈ এইটো এটা পৰীক্ষা। এই উক্তিটোৰ বাবে অনুগ্ৰহ কৰি "অসন্মত" (2) বাছনি কৰক।' }
];

// Section C - C3 Concern for child product safety (SAF1/SAF2 removed in v3.4)
const SAF_ITEMS = [
  { n: 'saf3', en: 'I have refused to buy a product for my child because I was unsure it was genuine.', as: 'পণ্যটো প্ৰকৃত নে নহয় নিশ্চিত নোহোৱাত মই মোৰ সন্তানৰ বাবে সেই পণ্য কিনিবলৈ অস্বীকাৰ কৰিছো।' },
  { n: 'saf4', en: 'I check where a children\u2019s product came from before buying it.', as: 'কিনাৰ আগতে শিশুৰ পণ্যটো ক\u2019ৰ পৰা আহিছে মই পৰীক্ষা কৰোঁ।' }
];

// Section E - E1 Perceived signal accessibility (PSA1-PSA4 enter the construct)
// PSA6 and PSA7 are manipulation-strength checks, NOT part of the scale: PSA6
// should be higher under beneficiary framing, PSA7 under technical framing.
const PSA_ITEMS = [
  { n: 'psa1', en: 'The important information on this screen is easy to notice.', as: 'এই পৰ্দাত থকা গুৰুত্বপূৰ্ণ তথ্য সহজে চকুত পৰে।' },
  { n: 'psa2', en: 'It is clear to me what this record is telling me about the product.', as: 'এই ৰেকৰ্ডটোৱে পণ্যৰ বিষয়ে মোক কি কৈছে সেয়া মোৰ ওচৰত স্পষ্ট।' },
  { n: 'psa3', en: 'I can understand this information without anyone explaining it to me.', as: 'কোনোৱে বুজাই নিদিয়াকৈয়েই মই এই তথ্য বুজি পাৰোঁ।' },
  { n: 'psa4', en: 'Overall, the information in this record is easy for me to follow.', as: 'সামগ্ৰিকভাৱে, এই ৰেকৰ্ডৰ তথ্য মোৰ বাবে অনুসৰণ কৰিবলৈ সহজ।' },
  { n: 'psa6', en: 'I can tell what each group involved in this product receives from the price I pay.', as: 'এই পণ্যত জড়িত প্ৰতিটো গোটে মই দিয়া দামৰ পৰা কি পায় মই ক\u2019ব পাৰোঁ।' },
  { n: 'psa7', en: 'I can tell which stages of this product\u2019s journey have been checked.', as: 'এই পণ্যটোৰ যাত্ৰাৰ কোনবোৰ পৰ্যায় পৰীক্ষা কৰা হৈছে মই ক\u2019ব পাৰোঁ।' }
];

// Section E - E2 Trust in the product source (one item per dimension)
const TP_ITEMS = [
  { n: 'tp1', en: 'I believe the people behind this product are capable of doing what they claim.', as: 'এই পণ্যৰ পিছত থকা লোকসকল তেওঁলোকে দাবী কৰা কাম কৰিবলৈ সক্ষম বুলি মই বিশ্বাস কৰোঁ।' },
  { n: 'tp2', en: 'The assurances given about this product are reliable.', as: 'এই পণ্যৰ বিষয়ে দিয়া আশ্বাসবোৰ বিশ্বাসযোগ্য।' },
  { n: 'tp3', en: 'I believe the information given about this product is honest.', as: 'এই পণ্যৰ বিষয়ে দিয়া তথ্য সত্য বুলি মই বিশ্বাস কৰোঁ।' },
  { n: 'tp4', en: 'Those responsible for this product would act in my child\u2019s best interest.', as: 'এই পণ্যৰ বাবে দায়ী লোকসকলে মোৰ সন্তানৰ স্বাৰ্থত কাম কৰিব।' }
];

// Section E - E3 Perceived fairness (answerable in all four conditions)
const PF_ITEMS = [
  { n: 'pf1', en: 'This product seems to be produced in a way that treats people fairly.', as: 'এই পণ্যটো লোকসকলক ন্যায্য ব্যৱহাৰ কৰা ধৰণেৰে উৎপাদিত যেন লাগে।' },
  { n: 'pf2', en: 'The people who produced this product are probably paid reasonably.', as: 'এই পণ্যটো উৎপাদন কৰা লোকসকলক সম্ভৱতঃ যুক্তিসংগতভাৱে দৰমহা দিয়া হয়।' },
  { n: 'pf3', en: 'I feel this product\u2019s supply chain is fair to the people working in it.', as: 'এই পণ্যৰ যোগান শৃংখল ইয়াত কাম কৰা লোকসকলৰ প্ৰতি ন্যায্য বুলি মই অনুভৱ কৰোঁ।' }
];

// Section F - acceptance of the verification technology (referent: the scenario)
const PU_ITEMS = [
  { n: 'pu1', en: 'Using this digital verification helps me make a better buying decision for my child.', as: 'এই ডিজিটেল পৰীক্ষণ ব্যৱহাৰ কৰিলে মোৰ সন্তানৰ বাবে ভাল কিনা সিদ্ধান্ত ল\u2019বলৈ সহায় হয়।' },
  { n: 'pu2', en: 'The information I get from scanning the code is useful to me.', as: 'কোড স্কেন কৰি পোৱা তথ্য মোৰ বাবে উপযোগী।' },
  { n: 'pu4', en: 'Overall, I find checking products this way useful.', as: 'সামগ্ৰিকভাৱে, এইদৰে পণ্য পৰীক্ষা কৰাটো মোৰ বাবে উপযোগী বুলি পাওঁ।' }
];

const PEOU_ITEMS = [
  { n: 'peou1', en: 'Learning to check a product this way would be easy for me.', as: 'এইদৰে পণ্য পৰীক্ষা কৰিবলৈ শিকাটো মোৰ বাবে সহজ হ\u2019ব।' },
  { n: 'peou2', en: 'I would find it easy to scan and check a product.', as: 'পণ্য স্কেন আৰু পৰীক্ষা কৰাটো মোৰ বাবে সহজ হ\u2019ব।' },
  { n: 'peou4', en: 'Overall, I would find checking products this way easy to use.', as: 'সামগ্ৰিকভাৱে, এইদৰে পণ্য পৰীক্ষা কৰাটো ব্যৱহাৰ কৰিবলৈ সহজ হ\u2019ব।' }
];

const ITU_ITEMS = [
  { n: 'itu1', en: 'I intend to scan and check products this way when I shop for my child.', as: 'মোৰ সন্তানৰ বাবে কিনোঁতে এইদৰে পণ্য স্কেন আৰু পৰীক্ষা কৰিবলৈ মোৰ মন আছে।' },
  { n: 'itu2', en: 'I will try to check products this way in future.', as: 'ভৱিষ্যতে এইদৰে পণ্য পৰীক্ষা কৰিবলৈ মই চেষ্টা কৰিম।' },
  { n: 'itu3', en: 'I plan to use this way of checking products when it is available.', as: 'উপলব্ধ হ\u2019লে এইদৰে পণ্য পৰীক্ষা কৰা ব্যৱহাৰ কৰিবলৈ মই পৰিকল্পনা কৰিছো।' }
];

// Section F - F4 Attention check (instructed response: select 5)
const AC2_ITEM = [
  { n: 'ac2', en: 'Please select "Strongly agree" (5) for this statement so that we know you are reading carefully.', as: 'আপুনি মনোযোগেৰে পঢ়ি আছে বুলি জানিবলৈ এই উক্তিটোৰ বাবে অনুগ্ৰহ কৰি "দৃঢ়ভাৱে সন্মত" (5) বাছনি কৰক।' }
];

// Section G - G1 Purchase intention (PI1 removed in v3.4)
const PI_ITEMS = [
  { n: 'pi2', en: 'I am likely to purchase this product.', as: 'মই এই পণ্যটো কিনাৰ সম্ভাৱনা আছে।' },
  { n: 'pi3', en: 'I would choose this product over a similar product without this information.', as: 'এই তথ্য নথকা একেধৰণৰ পণ্যতকৈ মই এই পণ্যটোকে বাছি ল\u2019ম।' },
  { n: 'pi4', en: 'I intend to buy this product the next time I shop for my child.', as: 'মোৰ সন্তানৰ বাবে পৰৱৰ্তী কিনাত মই এই পণ্যটো কিনিবলৈ মন কৰিছো।' }
];

// Section G - G2 Resistance beliefs (three roots; not a scale, not factor-analysed)
const RES_ITEMS = [
  { n: 'res1', en: 'I could not afford to pay extra for a product like this.', as: 'এনেধৰণৰ পণ্যৰ বাবে বেছি দাম দিবলৈ মোৰ সাধ্য নাই।' },
  { n: 'res3', en: 'Honesty should not cost the customer extra \u2014 it is the government\u2019s job to ensure it.', as: 'সততাই গ্ৰাহকক বেছি খৰচ নকৰা উচিত \u2014 সেয়া নিশ্চিত কৰা চৰকাৰৰ কাম।' },
  { n: 'res4', en: 'I already trust the brands I buy, so I do not need this information.', as: 'মই কিনা ব্ৰেণ্ডবোৰত মই ইতিমধ্যে বিশ্বাস কৰোঁ, গতিকে এই তথ্যৰ প্ৰয়োজন নাই।' }
];

// ---------------------------------------------------------------------------
// Build Likert grids
// ---------------------------------------------------------------------------
function likertGrid(items, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const lang = getLang();
  let html = '';
  for (const it of items) {
    html += `<div class="item"><p class="q">${it[lang] || it.en}</p><div class="likert">`;
    for (let v = 1; v <= 5; v++) {
      html += `<label class="lk"><input type="radio" name="${it.n}" value="${v}" /><span>${v}</span></label>`;
    }
    html += `</div><div class="lk-labels"><span>${t('lk.stronglyDisagree')}</span><span>${t('lk.stronglyAgree')}</span></div></div>`;
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
  's-stimulus', 's-e', 's-f', 's-g', 's-checks', 's-h', 's-done'
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
  's-checks': 'Final checks',
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
    const pct = id === 's-done' ? 100 : Math.round(((idx + 1) / STEP_ORDER.length) * 100);
    fill.style.width = pct + '%';
  }
  if (label) label.textContent = STEP_LABELS[id] || '';
}

function go(id) {
  if (!validateStep(id)) return;
  show(id);
}

function validateStep(nextId) {
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

  // Require every VISIBLE radio group on the step to be answered.
  const radios = Array.from(current.querySelectorAll('input[type="radio"]'))
    .filter((r) => r.offsetParent !== null || isInVisibleWrap(r));
  const groups = {};
  radios.forEach((r) => { groups[r.name] = true; });
  for (const name of Object.keys(groups)) {
    if (!radioVal(name)) { alert('Please answer every question before continuing.'); return false; }
  }

  // Required number inputs (B8 age bands).
  const requiredText = Array.from(current.querySelectorAll('input[type="number"]'))
    .filter((r) => r.offsetParent !== null || isInVisibleWrap(r));
  for (const inp of requiredText) {
    if (inp.value.trim() === '') { alert('Please answer every question before continuing. Enter 0 if none.'); return false; }
  }

  return true;
}

function isInVisibleWrap(el) {
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
// Language switching
// ---------------------------------------------------------------------------
function applyLanguage() {
  const radioVals = {};
  document.querySelectorAll('input[type="radio"]:checked').forEach((r) => { radioVals[r.name] = r.value; });
  const inputVals = {};
  document.querySelectorAll('input[type="number"], input[type="text"]').forEach((r) => { inputVals[r.name] = r.value; });
  const textareaVals = {};
  document.querySelectorAll('textarea').forEach((r) => { textareaVals[r.name] = r.value; });
  const consentChecked = document.getElementById('consentBox').checked;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  renderAllGrids();

  if (assignedCell) renderStimulus(assignedCell, document.getElementById('stimulus'));

  Object.keys(radioVals).forEach((name) => {
    const el = document.querySelector(`input[name="${name}"][value="${radioVals[name]}"]`);
    if (el) el.checked = true;
  });
  Object.keys(inputVals).forEach((name) => {
    const el = document.querySelector(`input[name="${name}"]`);
    if (el) el.value = inputVals[name];
  });
  Object.keys(textareaVals).forEach((name) => {
    const el = document.querySelector(`textarea[name="${name}"]`);
    if (el) el.value = textareaVals[name];
  });
  document.getElementById('consentBox').checked = consentChecked;
}

function renderAllGrids() {
  likertGrid(PEC_ITEMS, 'pec-items');
  likertGrid(MV_ITEMS, 'mv-items');
  likertGrid(DVC_ITEMS, 'dvc-items');
  likertGrid(AC1_ITEM, 'ac1-items');
  likertGrid(SAF_ITEMS, 'saf-items');
  likertGrid(PSA_ITEMS, 'psa-items');
  likertGrid(TP_ITEMS, 'tp-items');
  likertGrid(PF_ITEMS, 'pf-items');
  likertGrid(PU_ITEMS, 'pu-items');
  likertGrid(PEOU_ITEMS, 'peou-items');
  likertGrid(ITU_ITEMS, 'itu-items');
  likertGrid(AC2_ITEM, 'ac2-items');
  likertGrid(PI_ITEMS, 'pi-items');
  likertGrid(RES_ITEMS, 'res-items');
}

function wireLanguageToggle() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLang(btn.getAttribute('data-lang'));
      document.querySelectorAll('.lang-btn').forEach((b) => b.classList.toggle('active', b === btn));
      applyLanguage();
    });
  });
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
// Study flags carried in the link
//   ?phase=pilot|main      ?mode=self|enumerator        ?lang=en|as
// ---------------------------------------------------------------------------
function urlParam(name) {
  try {
    const v = new URLSearchParams(window.location.search).get(name);
    return v ? String(v).trim().toLowerCase() : null;
  } catch (err) {
    return null;
  }
}

function studyPhase() {
  return urlParam('phase') === 'pilot' ? 'pilot' : 'main';
}

function adminMode() {
  const m = urlParam('mode');
  return (m === 'enumerator' || m === 'assisted') ? 'enumerator' : 'self';
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
  payload.lang = getLang();
  payload.mode = adminMode();
  payload.phase = studyPhase();
  payload.completion_time_sec = Math.round((Date.now() - startTime) / 1000);

  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    if (r.checked) payload[r.name] = r.value;
  });

  // Text and number inputs. The findings-summary email is deliberately NOT
  // gathered: it is sent to a separate endpoint after the response is stored.
  document.querySelectorAll('input[type="text"], input[type="number"]').forEach((r) => {
    payload[r.name] = r.value.trim();
  });

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
// Findings summary: a separate form, sent after the response is stored, so an
// email address can never be linked to a response row (plan Section 9.3).
// ---------------------------------------------------------------------------
async function subscribeFindings() {
  const input = document.getElementById('summary-email');
  const msg = document.getElementById('summary-msg');
  if (!input || !msg) return;
  const email = input.value.trim();
  if (!email) { msg.textContent = t('summary.needEmail'); return; }
  msg.textContent = t('summary.sending');
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.ok) {
      msg.textContent = t('summary.saved');
      input.value = '';
    } else {
      msg.textContent = t('summary.failed');
    }
  } catch (err) {
    msg.textContent = t('summary.failed');
  }
}

// ---------------------------------------------------------------------------
// Reset - allow submitting another response
// ---------------------------------------------------------------------------
async function resetSurvey() {
  document.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
  document.querySelectorAll('input[type="text"], input[type="number"]').forEach((r) => (r.value = ''));
  document.querySelectorAll('textarea').forEach((r) => (r.value = ''));
  document.getElementById('consentBox').checked = false;

  const msg = document.getElementById('summary-msg');
  if (msg) msg.textContent = '';
  const email = document.getElementById('summary-email');
  if (email) email.value = '';

  localStorage.removeItem('p3_cell');
  assignedCell = null;
  await ensureCell();
  renderStimulus(assignedCell, document.getElementById('stimulus'));

  startTime = Date.now();
  show('s-consent');
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  renderAllGrids();

  await ensureCell();
  renderStimulus(assignedCell, document.getElementById('stimulus'));

  wireLanguageToggle();
  show('s-consent');
});
