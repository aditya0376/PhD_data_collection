'use strict';

// ---------------------------------------------------------------------------
// i18n layer for the Paper 3 survey site.
//
// Two languages are supported:
//   en  English (default)
//   as  Assamese (অসমীয়া)
//
// IMPORTANT — TRANSLATION STATUS
// The Assamese strings below are a DRAFT prepared for the site build. They
// MUST be verified by a bilingual researcher and passed through the forward
// translation / blind back-translation / third-reviewer reconciliation
// procedure described in the design protocol (§7.3) BEFORE the instrument is
// fielded. Do not treat these as final.
//
// To revise a translation, edit the value under the matching key in the `as`
// block below. No code changes are needed.
// ---------------------------------------------------------------------------

const I18N = {
  en: {
    // Header
    'site.title': 'Understanding Consumer Perception of Product Transparency',
    'site.subtitle': 'Centre for Management Studies, NERIST',
    'lang.english': 'English',
    'lang.assamese': 'অসমীয়া',

    // Consent (Section A)
    'consent.title': 'Information and Consent',
    'consent.intro': 'You are invited to take part in a research study conducted by Mr. Aditya Man Borborah, Assistant Professor, Assam Women\u2019s University, as part of doctoral research at the Centre for Management Studies, North Eastern Regional Institute of Science and Technology (NERIST).',
    'consent.about': 'What the study is about. This study examines how parents respond to different kinds of information printed on packaging for children\u2019s products, and how that information affects their buying decisions.',
    'consent.asked': 'What you will be asked to do. You will answer some questions about yourself and your shopping habits, read a short description of a product label, and then answer questions about your reactions to it. The survey takes about 10 to 12 minutes.',
    'consent.voluntary': 'Voluntary participation. Your participation is entirely voluntary. You may skip any question or stop at any point without giving a reason and without any consequence.',
    'consent.confidentiality': 'Confidentiality. Your answers are anonymous. No information that could identify you is recorded with your answers. If you choose to leave an email address at the end to receive a summary of the findings, it is collected separately and cannot be linked to your answers. Data will be reported only in aggregate form and will be used solely for academic research and publication. Data will be retained only as long as required for the research and then securely deleted, in line with the Digital Personal Data Protection Act, 2023.',
    'consent.risks': 'Risks and benefits. There are no foreseeable risks to participating. There is no payment for participation.',
    'consent.ethics': 'Ethics approval. This study has been approved by the Institutional Research Ethics Committee, NERIST [approval reference: ____________].',
    'consent.questions': 'Questions. For any questions about this research, contact: aditya@awu.ac.in (email) / +91-9707156777 (phone).',
    'consent.agree': 'I have read and understood the information above, and I voluntarily agree to participate in this study.',
    'btn.continue': 'Continue',

    // B1 screening
    'b1.title': 'About you',
    'b1.q': 'B1. Are you the parent or primary guardian of at least one child aged between 1 and 16 years?',
    'opt.yes': 'Yes',
    'opt.no': 'No',

    // Demographics B2-B11
    'b2.q': 'B2. Gender',
    'opt.male': 'Male',
    'opt.female': 'Female',
    'opt.preferNot': 'Prefer not to say',
    'b3.q': 'B3. Age',
    'opt.under25': 'Under 25',
    'opt.25_34': '25\u201334',
    'opt.35_44': '35\u201344',
    'opt.45_54': '45\u201354',
    'opt.55plus': '55 or above',
    'b4.q': 'B4. Highest level of education completed',
    'opt.upTo10': 'Up to Class 10',
    'opt.class12': 'Class 12 / Higher Secondary',
    'opt.diploma': 'Diploma / ITI',
    'opt.graduate': 'Graduate (Bachelor\u2019s)',
    'opt.postgrad': 'Postgraduate (Master\u2019s)',
    'opt.doctorate': 'Doctorate / Professional degree',
    'b5.q': 'B5. Occupation',
    'opt.private': 'Private sector',
    'opt.govt': 'Government / public sector',
    'opt.selfEmployed': 'Self-employed / business',
    'opt.agriculture': 'Agriculture',
    'opt.homemaker': 'Homemaker',
    'opt.dailyWage': 'Daily wage / informal work',
    'opt.student': 'Student',
    'opt.other': 'Other',
    'b6.q': 'B6. Approximate monthly household income (Rs)',
    'opt.below20k': 'Below 20,000',
    'opt.20_50k': '20,000\u201350,000',
    'opt.50_100k': '50,000\u20131,00,000',
    'opt.100_200k': '1,00,000\u20132,00,000',
    'opt.above200k': 'Above 2,00,000',
    'b7.q': 'B7. Number of children aged 1\u201316 in your household',
    'b7.placeholder': 'e.g. 2',
    'b8.q': 'B8. How many of your children are in each age group?',
    'b8.1_5': 'Aged 1\u20135',
    'b8.6_10': 'Aged 6\u201310',
    'b8.11_16': 'Aged 11\u201316',
    'b9.q': 'B9. Where do you live?',
    'opt.urban': 'Urban (town or city)',
    'opt.semiUrban': 'Semi-urban',
    'opt.rural': 'Rural / village',
    'b10.q': 'B10. How often do you scan QR codes printed on product packages?',
    'opt.never': 'Never',
    'opt.onceTwice': 'Once or twice ever',
    'opt.sometimes': 'Sometimes',
    'opt.often': 'Often',
    'opt.almostEvery': 'Almost every time I can',
    'b11.q': 'B11. Who usually buys packaged food, clothing or toys for your child?',
    'opt.mostlyMe': 'Mostly me',
    'opt.mostlySpouse': 'Mostly my spouse/partner',
    'opt.shared': 'Shared roughly equally',
    'opt.anotherFamily': 'Another family member',

    // Section B12-B15
    'habits.title': 'Shopping and Digital Habits',
    'habits.instr': 'Please indicate how much you agree or disagree with each statement below. There are no right or wrong answers.',
    'scale.note': '1 = Strongly disagree &nbsp; 2 = Disagree &nbsp; 3 = Neither agree nor disagree &nbsp; 4 = Agree &nbsp; 5 = Strongly agree',
    'habits.digitalAccess': 'Your digital access',
    'habits.techConfidence': 'Your confidence with technology',
    'habits.shopping': 'Your shopping habits',
    'habits.final': 'A few final statements',

    // Section C
    'c.title': 'Your Background Views',
    'c.instr': 'Please indicate how much you agree or disagree with each statement below. There are no right or wrong answers.',
    'c.dvcHeading': 'Confidence in checking products digitally',
    'c.dvcInstr': 'The next statements are about checking a product by scanning a code on the package with your phone.',
    'c.safHeading': 'Shopping for your child',

    // Section D - stimulus
    'stimulus.title': 'Product Scenario',
    'stimulus.instr': 'Please read the following carefully.',
    'stimulus.scenario': 'Imagine you are buying a packet of biscuits for your child, priced at Rs 50. The package carries a code that you can scan with your phone. When you scan it, the screen below appears.',
    'checks.title': 'A Few Final Checks',
    'h1.q': 'H1. The screen you saw mainly showed:',
    'h1.a': 'How the price is shared among the people involved',
    'h1.b': 'Which stages of the journey had been checked',
    'h1.c': 'Only the ingredients and the price',
    'h1.d': 'That the product was made in the same district where it is sold',
    'h2.q': 'H2. Did the screen show any government certification marks?',
    'opt.notSure': 'Not sure',
    'h3.q': 'H3. Still thinking about the screen you saw, please say how far you agree:',

    // Section E
    'e.title': 'Your Reactions to the Product',
    'e.instr': 'The remaining questions refer to the product and the screen you have just read about. Please answer thinking about buying this product for your child.',
    'e.psaHeading': 'What the information shows',
    'e.tpHeading': 'Trust in the product source',
    'e.pfHeading': 'Fairness',
    'e.psiHeading': 'What your purchase does for others',

    // Section F
    'f.title': 'The Checking Technology',
    'f.instr': 'The following questions are about checking products in the way you have just seen: scanning a code on the package with your phone and reading a screen like the one shown to you.',
    'f.puHeading': 'How useful it would be',
    'f.peouHeading': 'How easy it would be',
    'f.ituHeading': 'Whether you would use it',
    'f.peHeading': 'How it would feel',
    'f.snHeading': 'People around you',

    // Section G
    'g.title': 'Your Buying Decision',
    'g.instr': 'These questions are about <strong>the packet of biscuits you saw on the screen earlier</strong>.',
    'g.piHeading': 'Buying the product',
    'g.piInstr': 'These statements are about <strong>this product as described in the information shown earlier</strong>.',
    'g.resHeading': 'Your views',
    'g3.q': 'G3. How much more, if anything, would you be willing to pay for this Rs 50 product compared with a similar product that does not carry this information?',
    'opt.nothing': 'Nothing',
    'opt.upTo5': 'Up to 5%',
    'opt.5_10': 'More than 5% up to 10%',
    'opt.10_15': 'More than 10% up to 15%',
    'opt.moreThan15': 'More than 15%',
    'g4.q': 'G4. If you answered "Nothing", in your own words, what is the main reason?',
    'g4.englishNote': 'Please write your answer in English.',
    'opt.optional': 'Optional',
    'g5.q': 'G5. In your own words, how would knowing who benefits from your purchase affect your decision to buy products for your child?',
    'g5.englishNote': 'Please write your answer in English.',

    // Closing
    'closing.title': 'Almost done',
    'closing.thanks': 'Press Submit to send your answers. Nothing has been saved yet.',
    'btn.submit': 'Submit',
    'btn.send': 'Send',
    'summary.title': 'Findings summary',
    'summary.instr': 'If you would like a short summary of the findings when the study is complete, you may leave an email address. This is optional, it is sent in a separate form, and it is never stored with your answers.',
    'summary.placeholder': 'Optional email',
    'summary.needEmail': 'Please enter an email address, or ignore this box if you do not want the summary.',
    'summary.sending': 'Sending…',
    'summary.saved': 'Thank you. Your email address has been saved separately from your answers.',
    'summary.failed': 'That did not work. Please check the address and try again.',
    'done.title': 'Thank you',
    'done.thanks': 'Thank you for your time. Your responses will be used only for academic research and will be reported in aggregate form.',
    'btn.another': 'Submit another response',

    'btn.back': 'Back',
    'btn.saving': 'Saving…',
    'step.s-consent': 'Consent',
    'step.s-b1': 'About you',
    'step.s-demo': 'About you',
    'step.s-habits': 'Habits',
    'step.s-c': 'Your views',
    'step.s-stimulus': 'Product scenario',
    'step.s-e': 'Your reactions',
    'step.s-f': 'The technology',
    'step.s-g': 'Your decision',
    'step.s-checks': 'Final checks',
    'step.s-h': 'Almost done',
    'step.s-done': 'Done',
    'alert.consent': 'Please tick the consent box to continue.',
    'alert.b1': 'Please answer B1.',
    'alert.answerAll': 'Please answer every question before continuing.',
    'alert.b8integer': 'Please enter whole numbers only for the number of children.',
    'alert.b8range': 'Each children count must be between 0 and 15.',
    'alert.b8zero': 'You are recorded as a parent, so at least one age group needs a number above zero.',
    'alert.submitFail': 'There was a problem saving your response. Please try again.',
    'alert.network': 'Network error. Please check your connection and try again.',
    'thankyou.title': 'Thank you',
    'thankyou.msg': 'This survey is for parents who buy food products for their children. Thank you for your time.',

    // Likert scale labels
    'lk.stronglyDisagree': 'Strongly disagree',
    'lk.stronglyAgree': 'Strongly agree',

    // Stimulus content
    'stim.head.product': 'VERIFIED PRODUCT RECORD',
    'stim.head.value': 'VERIFIED VALUE RECORD',
    'stim.sharedOpen': 'Every step of this product\u2019s journey \u2014 from farm to shelf \u2014 is stored in a secure digital record that cannot be changed once entered.',
    'stim.sharedClose': 'This record is tamper-resistant. It cannot be altered by anyone in the supply chain.',
    'stim.verified': 'verified',
    'stim.techLine': 'This record shows which stages of the product\u2019s journey were checked and verified before it reached the shop.',
    'stim.benLine': 'This record shows how the price you pay is shared among the people involved at each stage.',
    'stim.coBrandLine': 'The brand behind this product is FSSAI-licensed and AGMARK-certified.',
    'stim.verId': 'Verification ID: TX-4471',
    'stage.harvest': 'Harvest',
    'stage.processing': 'Processing',
    'stage.packaging': 'Packaging',
    'stage.storage': 'Storage',
    'stage.transport': 'Transport',
    'stage.retail': 'Retail',
    'share.farmer': 'Farmer',
    'share.processing': 'Processing unit',
    'share.transport': 'Transport co-operative',
    'share.retailer': 'Retailer',
    'share.community': 'Community fund',
    'share.company': 'Company'
  },

  as: {
    // Header
    'site.title': 'পণ্যৰ স্বচ্ছতা সম্পৰ্কে গ্ৰাহকৰ ধাৰণা বুজা',
    'site.subtitle': 'ব্যৱস্থাপনা অধ্যয়ন কেন্দ্ৰ, NERIST',
    'lang.english': 'English',
    'lang.assamese': 'অসমীয়া',

    // Consent (Section A)
    'consent.title': 'তথ্য আৰু সন্মতি',
    'consent.intro': 'আপোনাক অসম মহিলা বিশ্ববিদ্যালয়ৰ সহযোগী অধ্যাপক শ্ৰী আদিত্য মান বৰবৰা ডাঙৰীয়াই চলোৱা এক গৱেষণা অধ্যয়নত অংশগ্ৰহণ কৰিবলৈ আমন্ত্ৰণ জনোৱা হৈছে। এই অধ্যয়ন উত্তৰ-পূব বিজ্ঞান আৰু প্ৰযুক্তি প্ৰতিষ্ঠান (NERIST)ৰ ব্যৱস্থাপনা অধ্যয়ন কেন্দ্ৰত ডক্টৰেল গৱেষণাৰ অংশ হিচাপে চলোৱা হৈছে।',
    'consent.about': 'অধ্যয়নটো কিয়। এই অধ্যয়নে শিশুৰ সামগ্ৰীৰ বস্তাবন্দীত ছপা বিভিন্ন ধৰণৰ তথ্যৰ প্ৰতি অভিভাৱকসকলে কেনে সঁহাৰি দিয়ে, আৰু সেই তথ্যই তেওঁলোকৰ কিনা সিদ্ধান্তত কেনে প্ৰভাৱ পেলায় সেই বিষয়ে পৰীক্ষা কৰে।',
    'consent.asked': 'আপোনাক কি কৰিবলৈ কোৱা হ\u2019ব। আপুনি নিজৰ আৰু আপোনাৰ কিনাকিনিৰ অভ্যাসৰ বিষয়ে কিছুমান প্ৰশ্নৰ উত্তৰ দিব, এটা পণ্যৰ লেবেলৰ চমু বৰ্ণনা পঢ়িব, আৰু তাৰ পিছত ইয়াৰ প্ৰতি আপোনাৰ প্ৰতিক্ৰিয়াৰ বিষয়ে প্ৰশ্নৰ উত্তৰ দিব। জৰীপটো প্ৰায় 10ৰ পৰা 12 মিনিট সময় লাগে।',
    'consent.voluntary': 'স্বেচ্ছামূলক অংশগ্ৰহণ। আপোনাৰ অংশগ্ৰহণ সম্পূৰ্ণ স্বেচ্ছামূলক। কাৰণ নিদিয়াকৈ আৰু কোনো পৰিণতি নোহোৱাকৈ আপুনি যিকোনো প্ৰশ্ন এৰি যাব পাৰে বা যিকোনো সময়ত বন্ধ কৰিব পাৰে।',
    'consent.confidentiality': 'গোপনীয়তা। আপোনাৰ উত্তৰবোৰ বেনামী। আপোনাৰ উত্তৰবোৰৰ সৈতে আপোনাক চিনাক্ত কৰিব পৰা কোনো তথ্য ৰেকৰ্ড কৰা নহয়। যদি ফলাফলৰ সাৰাংশ লাভ কৰিবলৈ আপুনি শেষত ইমেইল ঠিকনা এৰি যায়, সেইটো পৃথকে সংগ্ৰহ কৰা হয় আৰু আপোনাৰ উত্তৰবোৰৰ সৈতে সংযোগ কৰিব নোৱাৰি। তথ্য কেৱল সামগ্ৰিক ৰূপত প্ৰতিবেদন কৰা হ’ব আৰু কেৱল শিক্ষাগত গৱেষণা আৰু প্ৰকাশৰ বাবে ব্যৱহাৰ কৰা হ’ব। ডিজিটেল ব্যক্তিগত তথ্য সুৰক্ষা আইন, 2023 অনুসৰি তথ্য গৱেষণাৰ বাবে প্ৰয়োজন হোৱা সময়লৈকে সংৰক্ষণ কৰা হ’ব আৰু তাৰ পিছত নিৰাপদে মচি পেলোৱা হ’ব।',
    'consent.risks': 'বিপদ আৰু লাভ। অংশগ্ৰহণৰ কোনো আগতীয়া বিপদ নাই। অংশগ্ৰহণৰ বাবে কোনো পাৰিশ্ৰমিক নাই।',
    'consent.ethics': 'নৈতিকতা অনুমোদন। এই অধ্যয়ন NERISTৰ প্ৰতিষ্ঠানিক গৱেষণা নৈতিকতা সমিতিয়ে অনুমোদন কৰিছে [অনুমোদন সূত্ৰ: ____________]।',
    'consent.questions': 'প্ৰশ্ন। এই গৱেষণা সম্পৰ্কে যিকোনো প্ৰশ্নৰ বাবে যোগাযোগ কৰক: aditya@awu.ac.in (ইমেইল) / +91-9707156777 (ফোন)।',
    'consent.agree': 'মই ওপৰৰ তথ্যখিনি পঢ়িছো আৰু বুজিছো, আৰু মই স্বেচ্ছাই এই অধ্যয়নত অংশগ্ৰহণ কৰিবলৈ সন্মত।',
    'btn.continue': 'অগ্ৰসৰ হওক',

    // B1 screening
    'b1.title': 'আপোনাৰ বিষয়ে',
    'b1.q': 'B1. আপুনি 1ৰ পৰা 16 বছৰ বয়সৰ অন্ততঃ এজন সন্তানৰ অভিভাৱক বা প্ৰধান অভিভাৱক নেকি?',
    'opt.yes': 'হয়',
    'opt.no': 'নহয়',

    // Demographics B2-B11
    'b2.q': 'B2. লিংগ',
    'opt.male': 'পুৰুষ',
    'opt.female': 'মহিলা',
    'opt.preferNot': 'ক\u2019ব নিবিচাৰোঁ',
    'b3.q': 'B3. বয়স',
    'opt.under25': '25 বছৰৰ তলত',
    'opt.25_34': '25\u201334',
    'opt.35_44': '35\u201344',
    'opt.45_54': '45\u201354',
    'opt.55plus': '55 বা তাতকৈ বেছি',
    'b4.q': 'B4. সম্পূৰ্ণ কৰা সৰ্বোচ্চ শিক্ষাগত স্তৰ',
    'opt.upTo10': 'দশম শ্ৰেণীলৈকে',
    'opt.class12': 'দ্বাদশ শ্ৰেণী / উচ্চতৰ মাধ্যমিক',
    'opt.diploma': 'ডিপ্ল\u2019মা / আইটিআই',
    'opt.graduate': 'স্নাতক',
    'opt.postgrad': 'স্নাতকোত্তৰ',
    'opt.doctorate': 'ডক্টৰেট / ব্যৱসায়িক ডিগ্ৰী',
    'b5.q': 'B5. পেচা',
    'opt.private': 'ব্যক্তিগত খণ্ড',
    'opt.govt': 'চৰকাৰী / ৰাজহুৱা খণ্ড',
    'opt.selfEmployed': 'স্ব-নিয়োজিত / ব্যৱসায়',
    'opt.agriculture': 'কৃষি',
    'opt.homemaker': 'গৃহিণী',
    'opt.dailyWage': 'দৈনিক মজুৰিয়া / অনানুষ্ঠানিক কাম',
    'opt.student': 'ছাত্ৰ/ছাত্ৰী',
    'opt.other': 'আন',
    'b6.q': 'B6. আনুমানিক মাহিলী পৰিয়ালৰ আয় (টকা)',
    'opt.below20k': '20,000 তলত',
    'opt.20_50k': '20,000\u201350,000',
    'opt.50_100k': '50,000\u20131,00,000',
    'opt.100_200k': '1,00,000\u20132,00,000',
    'opt.above200k': '2,00,000 তাতকৈ বেছি',
    'b7.q': 'B7. আপোনাৰ পৰিয়ালত 1\u201316 বছৰ বয়সৰ সন্তানৰ সংখ্যা',
    'b7.placeholder': 'যেনে 2',
    'b8.q': 'B8. আপোনাৰ প্ৰতিটো বয়স গোটত কিমানজন সন্তান আছে?',
    'b8.1_5': '1\u20135 বছৰ',
    'b8.6_10': '6\u201310 বছৰ',
    'b8.11_16': '11\u201316 বছৰ',
    'b9.q': 'B9. আপুনি ক\u2019ত থাকে?',
    'opt.urban': 'চহৰীয়া (চহৰ বা নগৰ)',
    'opt.semiUrban': 'আধা-চহৰীয়া',
    'opt.rural': 'গ্ৰাম্য / গাঁও',
    'b10.q': 'B10. পণ্যৰ বাকচত ছপা QR কোড কিমানবাৰ স্কেন কৰে?',
    'opt.never': 'কেতিয়াও নহয়',
    'opt.onceTwice': 'এবাৰ বা দুবাৰ',
    'opt.sometimes': 'কেতিয়াবা',
    'opt.often': 'প্ৰায়ে',
    'opt.almostEvery': 'পাৰিলে প্ৰায়বাৰেই',
    'b11.q': 'B11. সাধাৰণতে আপোনাৰ সন্তানৰ বাবে বস্তাবন্দী খাদ্য, কাপোৰ বা খেলনা কোনে কিনে?',
    'opt.mostlyMe': 'বেছিভাগ ময়েই',
    'opt.mostlySpouse': 'বেছিভাগ মোৰ স্বামী/স্ত্ৰী/সংগী',
    'opt.shared': 'প্ৰায় সমানে ভাগ',
    'opt.anotherFamily': 'আন এজন পৰিয়ালৰ সদস্য',

    // Section B12-B15
    'habits.title': 'কিনাকিনি আৰু ডিজিটেল অভ্যাস',
    'habits.instr': 'তলৰ প্ৰতিটো উক্তিৰ সৈতে আপুনি কিমান সন্মত বা অসন্মত সেইটো দৰ্শাওক। কোনো শুদ্ধ বা ভুল উত্তৰ নাই।',
    'scale.note': '1 = দৃঢ়ভাৱে অসন্মত &nbsp; 2 = অসন্মত &nbsp; 3 = সন্মত বা অসন্মত দুয়োটা নহয় &nbsp; 4 = সন্মত &nbsp; 5 = দৃঢ়ভাৱে সন্মত',
    'habits.digitalAccess': 'আপোনাৰ ডিজিটেল সুবিধা',
    'habits.techConfidence': 'প্ৰযুক্তিৰ প্ৰতি আপোনাৰ আত্মবিশ্বাস',
    'habits.shopping': 'আপোনাৰ কিনাকিনিৰ অভ্যাস',
    'habits.final': 'কেইটামান অন্তিম উক্তি',

    // Section C
    'c.title': 'আপোনাৰ পটভূমিৰ মতামত',
    'c.instr': 'তলৰ প্ৰতিটো উক্তিৰ সৈতে আপুনি কিমান সন্মত বা অসন্মত সেইটো দৰ্শাওক। কোনো শুদ্ধ বা ভুল উত্তৰ নাই।',
    'c.dvcHeading': 'ডিজিটেলভাৱে পণ্য পৰীক্ষা কৰাত আত্মবিশ্বাস',
    'c.dvcInstr': 'পৰৱৰ্তী উক্তিবোৰ ফোনেৰে বাকচত থকা কোড স্কেন কৰি পণ্য পৰীক্ষা কৰাৰ বিষয়ে।',
    'c.safHeading': 'আপোনাৰ সন্তানৰ বাবে কিনাকিনি',

    // Section D - stimulus
    'stimulus.title': 'পণ্যৰ পৰিস্থিতি',
    'stimulus.instr': 'অনুগ্ৰহ কৰি তলৰ কথাখিনি মনোযোগেৰে পঢ়ক।',
    'stimulus.scenario': 'কল্পনা কৰক আপুনি আপোনাৰ সন্তানৰ বাবে 50 টকা দামৰ এটা বিস্কুটৰ পেকেট কিনি আছে। বাকচটোত এটা কোড আছে যিটো আপুনি ফোনেৰে স্কেন কৰিব পাৰে। স্কেন কৰিলে তলৰ স্ক্ৰীনটো দেখা যায়।',
    'checks.title': 'অলপ শেষ পৰীক্ষা',
    'h1.q': 'H1. আপুনি দেখা স্ক্ৰীনটোৱে মূলতঃ দেখুৱাইছিল:',
    'h1.a': 'দাম কেনেকৈ জড়িত লোকসকলৰ মাজত ভাগ হয়',
    'h1.b': 'যাত্ৰাৰ কোনবোৰ পৰ্যায় পৰীক্ষা কৰা হৈছিল',
    'h1.c': 'কেৱল উপাদান আৰু দাম',
    'h1.d': 'পণ্যটো য\u2019ত বিক্ৰী হয় সেই একে জিলাতে তৈয়াৰ হৈছিল',
    'h2.q': 'H2. স্ক্ৰীনটোত কোনো চৰকাৰী প্ৰমাণপত্ৰ চিহ্ন দেখুওৱা হৈছিল নেকি?',
    'opt.notSure': 'নিশ্চিত নহয়',
    'h3.q': 'H3. আপুনি দেখা স্ক্ৰীনটোৰ কথা ভাবিয়েই কওক, আপুনি কিমান সন্মত:',

    // Section E
    'e.title': 'পণ্যৰ প্ৰতি আপোনাৰ প্ৰতিক্ৰিয়া',
    'e.instr': 'অৱশিষ্ট প্ৰশ্নবোৰ আপুনি এইমাত্ৰ পঢ়ি থকা পণ্য আৰু পৰ্দাৰ বিষয়ে। এই পণ্যটো আপোনাৰ সন্তানৰ বাবে কিনা কথা ভাবি উত্তৰ দিয়ক।',
    'e.psaHeading': 'তথ্যই কি দেখুৱায়',
    'e.tpHeading': 'পণ্যৰ উৎসৰ প্ৰতি বিশ্বাস',
    'e.pfHeading': 'ন্যায্যতা',
    'e.psiHeading': 'আপোনাৰ কিনাই আনৰ বাবে কি কৰে',

    // Section F
    'f.title': 'পৰীক্ষণ প্ৰযুক্তি',
    'f.instr': 'তলৰ প্ৰশ্নবোৰ আপুনি এইমাত্ৰ দেখাৰ দৰে পণ্য পৰীক্ষা কৰাৰ বিষয়ে — অৰ্থাৎ ফোনেৰে পেকেজৰ কোড স্কেন কৰি দেখুওৱাৰ দৰে পৰ্দা পঢ়াৰ বিষয়ে।',
    'f.puHeading': 'ই কিমান উপযোগী হ\u2019ব',
    'f.peouHeading': 'ই কিমান সহজ হ\u2019ব',
    'f.ituHeading': 'আপুনি ইয়াক ব্যৱহাৰ কৰিব নে নকৰে',
    'f.peHeading': 'ই কেনে অনুভৱ হ\u2019ব',
    'f.snHeading': 'আপোনাৰ চৌপাশৰ লোকসকল',

    // Section G
    'g.title': 'আপোনাৰ কিনা সিদ্ধান্ত',
    'g.instr': 'এই প্ৰশ্নবোৰ আপুনি আগতে স্ক্ৰীনত দেখা বিস্কুটৰ পেকেটটোৰ বিষয়ে।',
    'g.piHeading': 'পণ্যটো কিনা',
    'g.piInstr': 'এই উক্তিবোৰ আগতে দেখুওৱা তথ্যত বৰ্ণনা কৰা এই পণ্যটোৰ বিষয়ে।',
    'g.resHeading': 'আপোনাৰ মতামত',
    'g3.q': 'G3. এই তথ্য নথকা একেধৰণৰ পণ্যৰ তুলনাত এই 50 টকাৰ পণ্যটোৰ বাবে আপুনি কিমান বেছি দিবলৈ ইচ্ছুক হ\u2019ব?',
    'opt.nothing': 'একো নহয়',
    'opt.upTo5': '5%লৈকে',
    'opt.5_10': '5%তকৈ বেছি 10%লৈকে',
    'opt.10_15': '10%তকৈ বেছি 15%লৈকে',
    'opt.moreThan15': '15%তকৈ বেছি',
    'g4.q': 'G4. যদি আপুনি "একো নহয়" উত্তৰ দিছে, তেন্তে আপোনাৰ নিজৰ শব্দত মূল কাৰণটো কি?',
    'g4.englishNote': 'অনুগ্ৰহ কৰি আপোনাৰ উত্তৰ ইংৰাজীত লিখক।',
    'opt.optional': 'ঐচ্ছিক',
    'g5.q': 'G5. আপোনাৰ নিজৰ শব্দত, আপোনাৰ কিনাৰ পৰা কোনে লাভৱান হয় সেইটো জানিলে আপোনাৰ সন্তানৰ বাবে পণ্য কিনা সিদ্ধান্তত কেনে প্ৰভাৱ পৰিব?',
    'g5.englishNote': 'অনুগ্ৰহ কৰি আপোনাৰ উত্তৰ ইংৰাজীত লিখক।',

    // Closing
    'closing.title': 'প্ৰায় শেষ',
    'closing.thanks': 'আপোনাৰ উত্তৰ পঠিয়াবলৈ দাখিল কৰক টিপক। এতিয়ালৈকে একো সংৰক্ষণ কৰা হোৱা নাই।',
    'closing.emailInstr': 'অধ্যয়ন সম্পূৰ্ণ হ\u2019লে ফলাফলৰ এটা চমু সাৰাংশ লাভ কৰিব বিচাৰিলে আপুনি তলত এটা ইমেইল ঠিকনা দিব পাৰে। এইটো সম্পূৰ্ণ ঐচ্ছিক আৰু আপোনাৰ উত্তৰবোৰৰ পৰা পৃথকে সংৰক্ষণ কৰা হ\u2019ব।',
    'closing.emailPlaceholder': 'ঐচ্ছিক ইমেইল',
    'btn.submit': 'দাখিল কৰক',
    'btn.send': 'পঠিয়াওক',
    'summary.title': 'ফলাফলৰ সাৰাংশ',
    'summary.instr': 'অধ্যয়ন সম্পূৰ্ণ হ\u2019লে ফলাফলৰ এটা চমু সাৰাংশ লাভ কৰিব বিচাৰিলে আপুনি এটা ইমেইল ঠিকনা দিব পাৰে। এইটো ঐচ্ছিক, পৃথক ফৰ্মত পঠিওৱা হয়, আৰু আপোনাৰ উত্তৰবোৰৰ সৈতে কেতিয়াও সংৰক্ষণ কৰা নহয়।',
    'summary.placeholder': 'ঐচ্ছিক ইমেইল',
    'summary.needEmail': 'অনুগ্ৰহ কৰি এটা ইমেইল ঠিকনা দিয়ক, বা সাৰাংশ নিবিচাৰিলে এই ঘৰটো এৰি দিয়ক।',
    'summary.sending': 'পঠিওৱা হৈছে…',
    'summary.saved': 'ধন্যবাদ। আপোনাৰ ইমেইল ঠিকনা আপোনাৰ উত্তৰবোৰৰ পৰা পৃথকে সংৰক্ষণ কৰা হৈছে।',
    'summary.failed': 'এইটো কাম নহ\u2019ল। অনুগ্ৰহ কৰি ঠিকনাটো পৰীক্ষা কৰি পুনৰ চেষ্টা কৰক।',
    'done.title': 'ধন্যবাদ',
    'done.thanks': 'আপোনাৰ সময়ৰ বাবে ধন্যবাদ। আপোনাৰ উত্তৰবোৰ কেৱল শিক্ষাগত গৱেষণাৰ বাবে ব্যৱহাৰ কৰা হ\u2019ব আৰু সামগ্ৰিক ৰূপত প্ৰতিবেদন কৰা হ\u2019ব।',
    'btn.another': 'আন এটা উত্তৰ দাখিল কৰক',

    'btn.back': 'পিছলৈ',
    'btn.saving': 'সংৰক্ষণ কৰি আছে…',
    'step.s-consent': 'সন্মতি',
    'step.s-b1': 'আপোনাৰ বিষয়ে',
    'step.s-demo': 'আপোনাৰ বিষয়ে',
    'step.s-habits': 'অভ্যাস',
    'step.s-c': 'আপোনাৰ মতামত',
    'step.s-stimulus': 'পণ্যৰ পৰিৱেশ',
    'step.s-e': 'আপোনাৰ প্ৰতিক্ৰিয়া',
    'step.s-f': 'প্ৰযুক্তি',
    'step.s-g': 'আপোনাৰ সিদ্ধান্ত',
    'step.s-checks': 'শেষ পৰীক্ষা',
    'step.s-h': 'প্ৰায় শেষ',
    'step.s-done': 'সম্পূৰ্ণ',
    'alert.consent': 'আগবাঢ়িবলৈ সন্মতিৰ ঘৰটোত টিক দিয়ক।',
    'alert.b1': 'অনুগ্ৰহ কৰি B1 ৰ উত্তৰ দিয়ক।',
    'alert.answerAll': 'আগবাঢ়িবলৈ প্ৰতিটো প্ৰশ্নৰ উত্তৰ দিয়ক।',
    'alert.b8integer': 'সন্তানৰ সংখ্যাৰ বাবে কেৱল পূৰ্ণ সংখ্যা দিয়ক।',
    'alert.b8range': 'প্ৰতিটো সংখ্যা 0 ৰ পৰা 15 ৰ ভিতৰত হ’ব লাগে।',
    'alert.b8zero': 'আপুনি অভিভাৱক বুলি উল্লেখ কৰিছে, গতিকে অন্ততঃ এটা বয়স শ্ৰেণীত শূন্যতকৈ বেছি সংখ্যা দিয়ক।',
    'alert.submitFail': 'আপোনাৰ উত্তৰ সংৰক্ষণত সমস্যা হ’ল। পুনৰ চেষ্টা কৰক।',
    'alert.network': 'নেটৱৰ্ক ত্ৰুটি। সংযোগ পৰীক্ষা কৰি পুনৰ চেষ্টা কৰক।',
    'thankyou.title': 'ধন্যবাদ',
    'thankyou.msg': 'এই জৰীপটো সন্তানৰ বাবে খাদ্য পণ্য কিনা অভিভাৱকসকলৰ বাবে। আপোনাৰ সময়ৰ বাবে ধন্যবাদ।',

    // Likert scale labels
    'lk.stronglyDisagree': 'দৃঢ়ভাৱে অসন্মত',
    'lk.stronglyAgree': 'দৃঢ়ভাৱে সন্মত',

    // Stimulus content
    'stim.head.product': 'পৰীক্ষিত পণ্য ৰেকৰ্ড',
    'stim.head.value': 'পৰীক্ষিত মূল্য ৰেকৰ্ড',
    'stim.sharedOpen': 'এই পণ্যৰ যাত্ৰাৰ প্ৰতিটো পদক্ষেপ \u2014 খেতিপথাৰৰ পৰা দোকানৰ বাচনলৈকে \u2014 এটা সুৰক্ষিত ডিজিটেল ৰেকৰ্ডত সংৰক্ষিত হয় যিটো এবাৰ দাখিল কৰিলে সলনি কৰিব নোৱাৰি।',
    'stim.sharedClose': 'এই ৰেকৰ্ডটো ছুটি-বুটি নোৱাৰা। যোগান শৃংখলৰ কোনোৱেই ইয়াক সলনি কৰিব নোৱাৰে।',
    'stim.verified': 'পৰীক্ষিত',
    'stim.techLine': 'এই ৰেকৰ্ডে দেখুৱায় যে পণ্যটোৰ যাত্ৰাৰ কোনবোৰ পৰ্যায় দোকানত উপনীত হোৱাৰ আগতে পৰীক্ষা আৰু সত্যাপন কৰা হৈছে।',
    'stim.benLine': 'এই ৰেকৰ্ডে দেখুৱায় যে আপুনি দিয়া দাম প্ৰতিটো পৰ্যায়ত জড়িত লোকসকলৰ মাজত কেনেকৈ ভাগ হয়।',
    'stim.coBrandLine': 'এই পণ্যৰ পিছত থকা ব্ৰেণ্ডটো FSSAI-অনুমোদিত আৰু AGMARK-প্ৰমাণিত।',
    'stim.verId': 'পৰীক্ষণ আইডি: TX-4471',
    'stage.harvest': 'খেতি',
    'stage.processing': 'প্ৰক্ৰিয়াকৰণ',
    'stage.packaging': 'বস্তাবন্দী',
    'stage.storage': 'সংৰক্ষণ',
    'stage.transport': 'পৰিবহণ',
    'stage.retail': 'খুচুৰা বিক্ৰী',
    'share.farmer': 'খেতিয়ক',
    'share.processing': 'প্ৰক্ৰিয়াকৰণ একক',
    'share.transport': 'পৰিবহণ সমবায়',
    'share.retailer': 'খুচুৰা বিক্ৰেতা',
    'share.community': 'সমাজ পুঁজি',
    'share.company': 'কোম্পানী'
  }
};

let currentLang = 'en';

function t(key) {
  const dict = I18N[currentLang] || I18N.en;
  if (dict[key] !== undefined) return dict[key];
  if (I18N.en[key] !== undefined) return I18N.en[key];
  return key;
}

function getLang() {
  return currentLang;
}

function setLang(lang) {
  if (I18N[lang]) currentLang = lang;
  if (typeof document !== 'undefined') document.documentElement.lang = currentLang;
  return currentLang;
}

// Expose for browser use.
if (typeof window !== 'undefined') {
  window.I18N = I18N;
  window.t = t;
  window.getLang = getLang;
  window.setLang = setLang;
}

// Expose for Node use (tests).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { I18N, t, getLang, setLang };
}