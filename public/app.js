'use strict';

// ---------------------------------------------------------------------------
// Paper 3 instrument, Version 3.3 (TAM3), per Paper3_Objectives_Analysis v2.3.
// 65 Likert items in total:
//   B block: PEC(3) GDS(3) TPR(3) MV(3)                          = 12
//   C block: DVC(4) AC1(1) SAF(4)                                =  9
//   E block: PSA(4) TP(6) PF(3) PSI(5)                           = 18
//   F block: PU(4) PEOU(4) ITU(3) PE(3) SN(3) AC2(1)             = 18
//   G block: PI(4) RES(4)                                        =  8
// plus the Section H manipulation checks: mc_a and mc_b are categorical recall,
// mc_share and mc_stages are the scale-rated manipulation-strength items
// (plan Section 10, Step 2). Email is NOT collected here (plan Section 9.3): it
// goes to a separate form after the response is stored.
//
// Changes from v3.2: PSA reduced from 6 items to 4 and made condition-neutral
// (no accuracy judgement, no journey wording); PF2 reworded; two manipulation-
// strength items added.
//
// 5-point Likert: 1 = Strongly disagree ... 5 = Strongly agree
// SAF2 is reverse-coded at analysis; no (R) marker is shown to respondents.
//
// Each item carries both languages: `en` (English) and `as` (Assamese). The
// active language is read via getLang() from i18n.js. The Assamese strings are
// DRAFT translations and must be verified/back-translated before fielding
// (see i18n.js header and TRANSLATION_TODO.md).
// ---------------------------------------------------------------------------

// Section B - B12 Perceptions of external control (digital access)
const PEC_ITEMS = [
  { n: 'pec1', en: 'I have a phone that can scan codes on product packages.', as: 'মোৰ হাতত এনে এটা ফোন আছে যিটোৰে পণ্যৰ বাকচত থকা কোড স্কেন কৰিব পাৰি।' },
  { n: 'pec2', en: 'I usually have enough mobile network or data to check a product while I am shopping.', as: 'কিনাকিনি কৰি থকা সময়ত পণ্য পৰীক্ষা কৰিবলৈ সাধাৰণতে মোৰ যথেষ্ট মোবাইল নেটৱৰ্ক বা ডেটা থাকে।' },
  { n: 'pec3', en: 'The shops where I buy things for my child have good enough network for this to work.', as: 'মই মোৰ সন্তানৰ বাবে কিনা দোকানবোৰত এই কামটো হ\u2019ব পৰাকৈ ভাল নেটৱৰ্ক থাকে।' }
];

// Section B - B13 General digital self-efficacy
const GDS_ITEMS = [
  { n: 'gds1', en: 'I am confident using my smartphone for most things I need to do.', as: 'প্ৰয়োজনীয় বেছিভাগ কামত মোৰ স্মাৰ্টফোন ব্যৱহাৰ কৰাত মই আত্মবিশ্বাসী।' },
  { n: 'gds2', en: 'I can usually work out how to use a new app on my own.', as: 'নতুন এপ এটা নিজে কেনেকৈ ব্যৱহাৰ কৰিব লাগে সাধাৰণতে মই বুজি পাওঁ।' },
  { n: 'gds3', en: 'I would describe myself as good with digital technology.', as: 'ডিজিটেল প্ৰযুক্তিত মই ভাল বুলি নিজকে বৰ্ণনা কৰিম।' }
];

// Section B - B14 Situational constraints (time pressure)
const TPR_ITEMS = [
  { n: 'tpr1', en: 'I am usually in a hurry when I shop for my family.', as: 'পৰিয়ালৰ বাবে কিনাকিনি কৰোঁতে সাধাৰণতে মই খৰখেদাত থাকোঁ।' },
  { n: 'tpr2', en: 'I often shop with my children with me, which makes it harder to take time over choices.', as: 'সন্তানক লগত লৈয়ে প্ৰায়ে কিনাকিনি কৰোঁ, যাৰ বাবে বাছনিৰ ওপৰত সময় দিয়া কঠিন হয়।' },
  { n: 'tpr3', en: 'I rarely have time to compare products carefully in the shop.', as: 'দোকানত পণ্যবোৰ ভালদৰে তুলনা কৰিবলৈ মোৰ সময় বিৰলভাৱে থাকে।' }
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

// Section C - C3 Concern for child product safety
const SAF_ITEMS = [
  { n: 'saf1', en: 'I would switch to a different brand if I learned it was safer for my child.', as: 'মোৰ সন্তানৰ বাবে বেছি সুৰক্ষিত বুলি জানিলে মই আন এটা ব্ৰেণ্ডলৈ সলনি কৰিম।' },
  { n: 'saf2', en: 'I sometimes buy products for my child without checking the label.', as: 'লেবেল নোচোৱাকৈয়ে মই কেতিয়াবা মোৰ সন্তানৰ বাবে পণ্য কিনো।' },
  { n: 'saf3', en: 'I have refused to buy a product for my child because I was unsure it was genuine.', as: 'পণ্যটো প্ৰকৃত নে নহয় নিশ্চিত নোহোৱাত মই মোৰ সন্তানৰ বাবে সেই পণ্য কিনিবলৈ অস্বীকাৰ কৰিছো।' },
  { n: 'saf4', en: 'I check where a children\u2019s product came from before buying it.', as: 'কিনাৰ আগতে শিশুৰ পণ্যটো ক\u2019ৰ পৰা আহিছে মই পৰীক্ষা কৰোঁ।' }
];

// Section E - E1 Perceived signal accessibility (v3.3: four items, worded so
// that they are answerable from either framing - visibility, clarity,
// comprehensibility and one global item. No accuracy judgement (that belongs to
// trust) and no journey wording (answerable only from the technical stimulus).
const PSA_ITEMS = [
  { n: 'psa1', en: 'This record makes visible the stages and the people involved in bringing this product to me.', as: 'এই ৰেকৰ্ডে এই পণ্যটো মোৰ ওচৰলৈ অনাত জড়িত পৰ্যায় আৰু লোকসকলক দৃশ্যমান কৰে।' },
  { n: 'psa2', en: 'It is clear to me what this record is telling me about the product.', as: 'এই ৰেকৰ্ডটোৱে পণ্যৰ বিষয়ে মোক কি কৈছে সেয়া মোৰ ওচৰত স্পষ্ট।' },
  { n: 'psa3', en: 'The information in this record is easy for me to understand.', as: 'এই ৰেকৰ্ডৰ তথ্য মোৰ বাবে বুজিবলৈ সহজ।' },
  { n: 'psa4', en: 'Overall, this record gives me a clear picture of the product and the people behind it.', as: 'সামগ্ৰিকভাৱে, এই ৰেকৰ্ডে পণ্যটো আৰু ইয়াৰ পিছত থকা লোকসকলৰ এটা স্পষ্ট চিত্ৰ মোক দিয়ে।' }
];

// Section E - E2 Trust in the product source
const TP_ITEMS = [
  { n: 'tp1', en: 'I believe the people behind this product are capable of doing what they claim.', as: 'এই পণ্যৰ পিছত থকা লোকসকল তেওঁলোকে দাবী কৰা কাম কৰিবলৈ সক্ষম বুলি মই বিশ্বাস কৰোঁ।' },
  { n: 'tp2', en: 'The assurances given about this product are reliable.', as: 'এই পণ্যৰ বিষয়ে দিয়া আশ্বাসবোৰ বিশ্বাসযোগ্য।' },
  { n: 'tp3', en: 'I believe the information given about this product is honest.', as: 'এই পণ্যৰ বিষয়ে দিয়া তথ্য সত্য বুলি মই বিশ্বাস কৰোঁ।' },
  { n: 'tp4', en: 'Those responsible for this product would act in my child\u2019s best interest.', as: 'এই পণ্যৰ বাবে দায়ী লোকসকলে মোৰ সন্তানৰ স্বাৰ্থত কাম কৰিব।' },
  { n: 'tp5', en: 'I can depend on this product being what it says it is.', as: 'এই পণ্যটো যি বুলি কোৱা হয় সেয়াই হ\u2019ব বুলি মই নিৰ্ভৰ কৰিব পাৰোঁ।' },
  { n: 'tp6', en: 'The claims made about this product are sincere.', as: 'এই পণ্যৰ বিষয়ে কৰা দাবীবোৰ আন্তৰিক।' }
];

// Section E - E3 Perceived fairness (worded to be answerable in all four cells)
const PF_ITEMS = [
  { n: 'pf1', en: 'This product seems to be produced in a way that treats people fairly.', as: 'এই পণ্যটো লোকসকলক ন্যায্য ব্যৱহাৰ কৰা ধৰণেৰে উৎপাদিত যেন লাগে।' },
  { n: 'pf2', en: 'The people who produced this product are paid fairly for their work.', as: 'এই পণ্যটো উৎপাদন কৰা লোকসকলক তেওঁলোকৰ কামৰ বাবে ন্যায্যভাৱে দৰমহা দিয়া হয়।' },
  { n: 'pf3', en: 'I feel this product\u2019s supply chain is fair to the people working in it.', as: 'এই পণ্যৰ যোগান শৃংখল ইয়াত কাম কৰা লোকসকলৰ প্ৰতি ন্যায্য বুলি মই অনুভৱ কৰোঁ।' }
];

// Section E - E4 Perceived social impact (outcome belief, NOT social influence)
const PSI_ITEMS = [
  { n: 'psi1', en: 'Buying products like this can help improve the lives of the people who produce them.', as: 'এনেধৰণৰ পণ্য কিনিলে উৎপাদনকাৰী লোকসকলৰ জীৱন উন্নত কৰাত সহায় হ\u2019ব পাৰে।' },
  { n: 'psi2', en: 'My buying choices can help reduce poverty among small producers.', as: 'মোৰ কিনা বাছনিবোৰে সৰু উৎপাদকসকলৰ মাজত দৰিদ্ৰতা হ্ৰাস কৰাত সহায় কৰিব পাৰে।' },
  { n: 'psi3', en: 'Buying products like this supports fair wages and decent working conditions.', as: 'এনেধৰণৰ পণ্য কিনিলে ন্যায্য মজুৰি আৰু ভাল কামৰ পৰিস্থিতি সমৰ্থন হয়।' },
  { n: 'psi4', en: 'People like me can make a difference to society through what we buy.', as: 'মোৰ দৰে লোকসকলে আমি কি কিনো তাৰ জৰিয়তে সমাজত পৰিৱৰ্তন আনিব পাৰে।' },
  { n: 'psi5', en: 'When I buy products like this, I feel my purchase does some good.', as: 'এনেধৰণৰ পণ্য কিনোঁতে মোৰ কিনাই কিছু ভাল কাম কৰে বুলি অনুভৱ কৰোঁ।' }
];

// Section F - acceptance of the verification technology (TAM3)
const PU_ITEMS = [
  { n: 'pu1', en: 'Using this digital verification helps me make a better buying decision for my child.', as: 'এই ডিজিটেল পৰীক্ষণ ব্যৱহাৰ কৰিলে মোৰ সন্তানৰ বাবে ভাল কিনা সিদ্ধান্ত ল\u2019বলৈ সহায় হয়।' },
  { n: 'pu2', en: 'The information I get from scanning the code is useful to me.', as: 'কোড স্কেন কৰি পোৱা তথ্য মোৰ বাবে উপযোগী।' },
  { n: 'pu3', en: 'Checking products this way improves the quality of my purchase decision.', as: 'এইদৰে পণ্য পৰীক্ষা কৰিলে মোৰ কিনা সিদ্ধান্তৰ মান উন্নত হয়।' },
  { n: 'pu4', en: 'Overall, I find checking products this way useful.', as: 'সামগ্ৰিকভাৱে, এইদৰে পণ্য পৰীক্ষা কৰাটো মোৰ বাবে উপযোগী বুলি পাওঁ।' }
];

const PEOU_ITEMS = [
  { n: 'peou1', en: 'Learning to check a product this way would be easy for me.', as: 'এইদৰে পণ্য পৰীক্ষা কৰিবলৈ শিকাটো মোৰ বাবে সহজ হ\u2019ব।' },
  { n: 'peou2', en: 'I would find it easy to scan and check a product.', as: 'পণ্য স্কেন আৰু পৰীক্ষা কৰাটো মোৰ বাবে সহজ হ\u2019ব।' },
  { n: 'peou3', en: 'Checking a product this way is clear and understandable.', as: 'এইদৰে পণ্য পৰীক্ষা কৰাটো স্পষ্ট আৰু বুজিব পৰা।' },
  { n: 'peou4', en: 'Overall, I would find checking products this way easy to use.', as: 'সামগ্ৰিকভাৱে, এইদৰে পণ্য পৰীক্ষা কৰাটো ব্যৱহাৰ কৰিবলৈ সহজ হ\u2019ব।' }
];

const ITU_ITEMS = [
  { n: 'itu1', en: 'I intend to scan and check products this way when I shop for my child.', as: 'মোৰ সন্তানৰ বাবে কিনোঁতে এইদৰে পণ্য স্কেন আৰু পৰীক্ষা কৰিবলৈ মোৰ মন আছে।' },
  { n: 'itu2', en: 'I will try to check products this way in future.', as: 'ভৱিষ্যতে এইদৰে পণ্য পৰীক্ষা কৰিবলৈ মই চেষ্টা কৰিম।' },
  { n: 'itu3', en: 'I plan to use this way of checking products when it is available.', as: 'উপলব্ধ হ\u2019লে এইদৰে পণ্য পৰীক্ষা কৰা ব্যৱহাৰ কৰিবলৈ মই পৰিকল্পনা কৰিছো।' }
];

const PE_ITEMS = [
  { n: 'pe1', en: 'I find the idea of checking products this way interesting.', as: 'এইদৰে পণ্য পৰীক্ষা কৰাৰ ধাৰণাটো মোৰ বাবে আকৰ্ষণীয়।' },
  { n: 'pe2', en: 'Checking products this way would be enjoyable.', as: 'এইদৰে পণ্য পৰীক্ষা কৰাটো আনন্দদায়ক হ\u2019ব।' },
  { n: 'pe3', en: 'I would find the process of scanning and checking a product pleasant.', as: 'পণ্য স্কেন আৰু পৰীক্ষা কৰা প্ৰক্ৰিয়াটো মোৰ বাবে সুখদায়ক হ\u2019ব।' }
];

const SN_ITEMS = [
  { n: 'sn1', en: 'People who are important to me would think I should check products this way.', as: 'মোৰ বাবে গুৰুত্বপূৰ্ণ লোকসকলে ভাবিব যে মোৰ এইদৰে পণ্য পৰীক্ষা কৰা উচিত।' },
  { n: 'sn2', en: 'People whose opinions I value would want me to check products this way.', as: 'যিসকলৰ মতামতক মই মূল্য দিওঁ তেওঁলোকে মোক এইদৰে পণ্য পৰীক্ষা কৰিবলৈ বিচাৰিব।' },
  { n: 'sn3', en: 'My family would expect me to check products this way when buying for my child.', as: 'সন্তানৰ বাবে কিনোঁতে মোৰ পৰিয়ালে মোক এইদৰে পণ্য পৰীক্ষা কৰিবলৈ আশা কৰিব।' }
];

// Section F - F6 Attention check (instructed response: select 5)
const AC2_ITEM = [
  { n: 'ac2', en: 'Please select "Strongly agree" (5) for this statement so that we know you are reading carefully.', as: 'আপুনি মনোযোগেৰে পঢ়ি আছে বুলি জানিবলৈ এই উক্তিটোৰ বাবে অনুগ্ৰহ কৰি "দৃঢ়ভাৱে সন্মত" (5) বাছনি কৰক।' }
];

// Section G - G1 Purchase intention
const PI_ITEMS = [
  { n: 'pi1', en: 'I would consider buying this product, as described in the information shown earlier, for my child.', as: 'আগতে দেখুওৱা তথ্যত বৰ্ণনা কৰা এই পণ্যটো মোৰ সন্তানৰ বাবে কিনিবলৈ মই বিবেচনা কৰিম।' },
  { n: 'pi2', en: 'I am likely to purchase this product, as described in the information shown earlier.', as: 'আগতে দেখুওৱা তথ্যত বৰ্ণনা কৰা এই পণ্যটো কিনাৰ সম্ভাৱনা আছে।' },
  { n: 'pi3', en: 'I would choose this product, as described in the information shown earlier, over a similar product without this information.', as: 'এই তথ্য নথকা একেধৰণৰ পণ্যতকৈ আগতে দেখুওৱা তথ্যত বৰ্ণনা কৰা এই পণ্যটোকে মই বাছি ল\u2019ম।' },
  { n: 'pi4', en: 'I intend to buy this product, as described in the information shown earlier, the next time I shop for my child.', as: 'মোৰ সন্তানৰ বাবে পৰৱৰ্তী কিনাত আগতে দেখুওৱা তথ্যত বৰ্ণনা কৰা এই পণ্যটো কিনিবলৈ মোৰ মন আছে।' }
];

// Section G - G2 Resistance beliefs (asked of ALL respondents)
const RES_ITEMS = [
  { n: 'res1', en: 'I could not afford to pay extra for a product like this.', as: 'এনেধৰণৰ পণ্যৰ বাবে বেছি দাম দিবলৈ মোৰ সাধ্য নাই।' },
  { n: 'res2', en: 'Checking products this way is not something I would do.', as: 'এইদৰে পণ্য পৰীক্ষা কৰাটো মই নকৰা কাম।' },
  { n: 'res3', en: 'Honesty should not cost the customer extra \u2014 it is the government\u2019s job to ensure it.', as: 'সততাই গ্ৰাহকক বেছি খৰচ নকৰা উচিত \u2014 সেয়া নিশ্চিত কৰা চৰকাৰৰ কাম।' },
  { n: 'res4', en: 'I already trust the brands I buy, so I do not need this information.', as: 'মই কিনা ব্ৰেণ্ডবোৰত মই ইতিমধ্যে বিশ্বাস কৰোঁ, গতিকে এই তথ্যৰ প্ৰয়োজন নাই।' }
];

// ---------------------------------------------------------------------------
// Section H - manipulation strength (plan Section 10, Step 2). Deliberately
// condition-specific: these exist to show that each framing delivered the
// information it was meant to deliver. They are NOT part of PSA.
// ---------------------------------------------------------------------------
const MC_STRENGTH_ITEMS = [
  { n: 'mc_share', en: 'The screen showed how the price I pay is shared among the people involved.', as: 'পৰ্দাটোত মই দিয়া দাম জড়িত লোকসকলৰ মাজত কেনেকৈ ভাগ হয় সেয়া দেখুওৱা হৈছিল।' },
  { n: 'mc_stages', en: 'The screen showed which stages of the journey had been checked.', as: 'পৰ্দাটোত যাত্ৰাৰ কোন কোন পৰ্যায় পৰীক্ষা কৰা হৈছিল সেয়া দেখুওৱা হৈছিল।' }
];

// ---------------------------------------------------------------------------
// Build Likert grids
// ---------------------------------------------------------------------------
function likertGrid(items, containerId) {
  const el = document.getElementById(containerId);
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
// Language switching
// ---------------------------------------------------------------------------
function applyLanguage() {
  // Capture current answers so nothing is lost when the grids re-render.
  const radioVals = {};
  document.querySelectorAll('input[type="radio"]:checked').forEach((r) => { radioVals[r.name] = r.value; });
  const inputVals = {};
  document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"]').forEach((r) => { inputVals[r.name] = r.value; });
  const textareaVals = {};
  document.querySelectorAll('textarea').forEach((r) => { textareaVals[r.name] = r.value; });
  const consentChecked = document.getElementById('consentBox').checked;

  // Swap static text (data-i18n) and placeholders (data-i18n-placeholder).
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  // Re-render all Likert grids in the new language.
  likertGrid(PEC_ITEMS, 'pec-items');
  likertGrid(GDS_ITEMS, 'gds-items');
  likertGrid(TPR_ITEMS, 'tpr-items');
  likertGrid(MV_ITEMS, 'mv-items');
  likertGrid(DVC_ITEMS, 'dvc-items');
  likertGrid(AC1_ITEM, 'ac1-items');
  likertGrid(SAF_ITEMS, 'saf-items');
  likertGrid(PSA_ITEMS, 'psa-items');
  likertGrid(TP_ITEMS, 'tp-items');
  likertGrid(PF_ITEMS, 'pf-items');
  likertGrid(PSI_ITEMS, 'psi-items');
  likertGrid(PU_ITEMS, 'pu-items');
  likertGrid(PEOU_ITEMS, 'peou-items');
  likertGrid(ITU_ITEMS, 'itu-items');
  likertGrid(PE_ITEMS, 'pe-items');
  likertGrid(SN_ITEMS, 'sn-items');
  likertGrid(AC2_ITEM, 'ac2-items');
  likertGrid(PI_ITEMS, 'pi-items');
  likertGrid(RES_ITEMS, 'res-items');
  likertGrid(MC_STRENGTH_ITEMS, 'mc-items');

  // Re-render the stimulus in the new language.
  if (assignedCell) renderStimulus(assignedCell, document.getElementById('stimulus'));

  // Restore captured answers.
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

  // Re-apply the conditional G4 visibility.
  document.getElementById('g4-wrap').style.display = (radioVals['g3_wtp'] === '0') ? 'block' : 'none';
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
// Supplementary flags carried in the study link, so that the same build can
// serve the pilot and the main study, and self-completed vs enumerator-
// administered respondents are recorded (plan Section 9.3).
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
  const p = urlParam('phase');
  return p === 'pilot' ? 'pilot' : 'main';
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

  // All radio groups
  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    if (r.checked) payload[r.name] = r.value;
  });

  // Text and number inputs. The findings-summary email is deliberately NOT
  // gathered: it is sent to a separate endpoint after the response is stored.
  document.querySelectorAll('input[type="text"], input[type="number"]').forEach((r) => {
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
  likertGrid(MC_STRENGTH_ITEMS, 'mc-items');

  await ensureCell();
  renderStimulus(assignedCell, document.getElementById('stimulus'));

  // Show G4 (open reason) only when G3 WTP = Nothing
  document.querySelectorAll('input[name="g3_wtp"]').forEach((r) => {
    r.addEventListener('change', () => {
      document.getElementById('g4-wrap').style.display = (radioVal('g3_wtp') === '0') ? 'block' : 'none';
    });
  });

  wireLanguageToggle();
  show('s-consent');
});