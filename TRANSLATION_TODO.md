# Translation work list â€” Assamese (instrument v3.4)

The Assamese strings in `public/i18n.js` and `public/app.js` are **draft**. The
design protocol (Â§9.3 of the objectives document) requires forward translation,
blind back-translation and bilingual reconciliation (Brislin) before fielding.
This file lists what changed or was added in v3.4 so the reviewer does not have
to diff the whole instrument.

## Reworded or new instrument items

| Key | English | Status |
|---|---|---|
| `psa1` | The important information on this screen is easy to notice. | reworded |
| `psa3` | I can understand this information without anyone explaining it to me. | reworded |
| `psa4` | Overall, the information in this record is easy for me to follow. | reworded |
| `psa6` | I can tell what each group involved in this product receives from the price I pay. | reworded (manipulation strength) |
| `psa7` | I can tell which stages of this product's journey have been checked. | new (manipulation strength) |
| `pi2` | I am likely to purchase this product. | reworded (referent removed) |
| `pi3` | I would choose this product over a similar product without this information. | reworded |
| `pi4` | I intend to buy this product the next time I shop for my child. | reworded |

Unchanged: PSA2, TP1â€“TP4, PF1â€“PF3, PU1/PU2/PU4, PEOU1/PEOU2/PEOU4, ITU1â€“ITU3,
DVC1â€“DVC4, PEC1â€“PEC2, MV1â€“MV3, SAF3â€“SAF4, RES1/RES3/RES4, AC1, AC2.

## Stimulus text

| Key | Change |
|---|---|
| `stim.techLine` | "This record shows which stages of the product's journey were checked and verified before it reached the shop." |
| `stim.benLine` | "This record shows how the price you pay is shared among the people involved at each stage." |
| `share.processing`, `share.transport`, `share.community` | restored to "Processing unit", "Transport co-operative", "Community fund" to match the approved instrument |

Word-count parity of the two middle blocks: measured at 76 words (D-1) against
78 (D-3) and 85 (D-2) against 87 (D-4), i.e. 2.6 per cent and 2.3 per cent â€” under
the 5 per cent ceiling. Re-check after translation; what matters is that the
technical and beneficiary blocks do not diverge systematically from each other.

## Interface strings added or changed

`consent.asked` (10 to 12 minutes), `consent.confidentiality` (email form
wording), `e.instr` (product just seen), `f.instr` (referent is the checking
shown), `checks.title` (Section H heading).

Removed constructs no longer need translations, but their keys are still in
`i18n.js` and may be deleted at leisure: `gds.*`, `tpr.*`, `psi.*`, `pe.*`,
`sn.*`, `e.psiHeading`, `f.peHeading`, `f.snHeading`, `b5.q`, `b7.q`, `b11.q`,
`g4.q`.

## How to verify coverage

```bash
node -e "const {I18N}=require('./public/i18n.js');const en=Object.keys(I18N.en);const as=Object.keys(I18N.as);console.log('missing in as:',en.filter(k=>!as.includes(k)));"
```

## Interface strings added in the fieldwork-safeguards pass

Alerts and step labels are now translated: `btn.back`, `btn.saving`,
`step.s-consent` … `step.s-done`, `alert.consent`, `alert.b1`, `alert.answerAll`,
`alert.b8integer`, `alert.b8range`, `alert.b8zero`, `alert.submitFail`,
`alert.network`. The consent paragraphs `consent.asked` (10-12 minutes) and
`consent.confidentiality` (email collected separately) were rewritten in both
languages, and Assamese numerals were normalised to Latin digits so the scenario
shows "50" consistently with the percentages.
