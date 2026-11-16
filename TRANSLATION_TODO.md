# Translation work list — Assamese (v3.3)

The Assamese strings in `public/i18n.js` and `public/app.js` are **draft**. The
design protocol (§7.3 / Section 9.3 of the objectives document) requires forward
translation, blind back-translation and bilingual reconciliation (Brislin)
before fielding. This file lists exactly what changed or was added in v3.3 so the
reviewer does not have to diff the whole instrument.

## New or reworded instrument items (need a fresh Brislin pass)

| Key | English | Status |
|---|---|---|
| `psa1` | This record makes visible the stages and the people involved in bringing this product to me. | reworded |
| `psa3` | The information in this record is easy for me to understand. | reworded (was "accurate and complete") |
| `psa4` | Overall, this record gives me a clear picture of the product and the people behind it. | reworded (was "journey visible") |
| `pf2` | The people who produced this product are paid fairly for their work. | reworded |
| `mc_share` | The screen showed how the price I pay is shared among the people involved. | **new** (H3a) |
| `mc_stages` | The screen showed which stages of the journey had been checked. | **new** (H3b) |
| `psa5`, `psa6` | — | **deleted** |

`psa2` and `pf1`, `pf3` are unchanged.

## Stimulus text (both languages, both framings)

| Key | Change |
|---|---|
| `stim.techLine` | now "This record lists each of the six stages that were checked for this product." (authenticity claim removed) |
| `stim.benLine` | now "This record shows how the price you pay is shared among the six parties." |
| `share.processing`, `share.transport`, `share.community` | shortened to single words so the two blocks match in word count |
| `stim.head.value` | no longer used — the card header is identical in all four versions |

After translation, re-check word-count parity: the English blocks are exactly
matched (72/72 and 81/81 words). Assamese will differ in absolute length; what
matters is that the technical and beneficiary blocks do not differ systematically
from each other.

## Interface strings added in v3.3

`h3.q` (H3 heading), `btn.send`, `summary.title`, `summary.instr`,
`summary.placeholder`, `summary.needEmail`, `summary.sending`, `summary.saved`,
`summary.failed`.

## How to verify coverage

```bash
node -e "const {I18N}=require('./public/i18n.js');const en=Object.keys(I18N.en);const as=Object.keys(I18N.as);console.log('missing in as:',en.filter(k=>!as.includes(k)));"
```
