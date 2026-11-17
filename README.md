# Paper 3 Survey Site (Node.js)

Custom survey-experiment website for PhD Paper 3 — a 2×2 between-subjects
experiment (**FRAME**: Technical vs Beneficiary × **COBRAND**: Absent vs Present).

- **Participant flow:** `http://localhost:3000/` — one shared link; each
  participant is block-randomized to one of the 4 cells.
- **Admin / version check:** `http://localhost:3000/admin.html` — preview each
  of the 4 versions directly and verify the correct manipulation-check answers.
- **Data storage:** a central Excel file (`data/responses.xlsx`) **and** a
  Google Sheet (cloud copy that survives server restarts). Every submission
  appends one row to both. CSV export is also available for SPSS/AMOS/R.
- **Instrument:** Version 3.4 (TAM3) - 41 Likert items across B/C/E/F/G blocks,
  2 attention checks and 2 manipulation-strength items (PSA6, PSA7). About 55
  questions in all, 10-12 minutes.
  2 attention checks and a 4-item manipulation-check block (H1–H4).

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000/ (participant) and
http://localhost:3000/admin.html (admin).

## Endpoints

| Route            | Purpose                                              |
|------------------|------------------------------------------------------|
| `/`              | Participant survey (randomized to one of 4 cells)    |
| `/admin.html`    | Admin: version previews, counts, downloads           |
| `/preview.html?cell=1..4` | Direct preview of one version + correct MC answers |
| `/api/assign`    | Block-randomized cell assignment (least-filled cell) |
| `/api/counts`    | Per-cell response counts                             |
| `/api/submit`    | Append one response row to the Excel file            |
| `/api/import`    | Merge an uploaded `.xlsx`/`.csv` into the sheet      |
| `/api/status`    | Sheet pipeline diagnostics (enabled, last error)     |
| `/api/export`    | Download `responses.xlsx`                            |
| `/api/export.csv`| Download `responses.csv`                             |

## Admin access (required before sharing the link)

`/admin.html`, its previews, both exports, the upload endpoint, `/api/counts` and
`/api/status` sit behind **HTTP Basic authentication**. Set two variables on the
host:

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | **Required.** Without it the whole admin surface returns 503, so it fails closed rather than open |
| `ADMIN_USER` | Optional; defaults to `admin` |

The participant endpoints stay public: `/`, `/api/assign`, `/api/submit`,
`/api/subscribe`, `/api/screenout`, `/api/config`.

The browser prompts once for the credentials and sends them on every admin
request, including the downloads and the upload, so no links can be used without
them. Use a long random password - this is the only thing between a stranger and
your dataset.

## Excel / Google Sheet columns (v3.4, 67 columns)

`id, submitted_at, cell_id, frame, cobrand, version, lang, lang_start, mode, phase,
completion_time_sec, scenario_time_sec, b1, b2, b3, b4, b6, b8_1, b8_2, b8_3, b9, b10,
pec1, pec2, mv1, mv2, mv3,
dvc1..dvc4, ac1, saf3, saf4,
psa1..psa4, psa6, psa7, tp1..tp4, pf1..pf3,
pu1, pu2, pu4, peou1, peou2, peou4, itu1..itu3, ac2,
pi2, pi3, pi4, res1, res3, res4, g3_wtp, g5_comment,
mc_a, mc_b`

- `frame` = 0 (Technical) / 1 (Beneficiary); `cobrand` = 0 (Absent) / 1 (Present).
- `lang` = `en` or `as` at submission; `lang_start` = the language the respondent
  began in. `mode` = `self` or `enumerator`; `phase` = `main` or `pilot`.
- `scenario_time_sec` = seconds spent on the product-scenario page, so instant
  skips are detectable.
- **PSA6 and PSA7 are manipulation-strength checks, not PSA items.** `psa1`-`psa4`
  form the construct; PSA6 should be higher under beneficiary framing, PSA7 higher
  under technical framing. Never score `psa1..psa7` as one scale.
- **Item codes keep the gaps of earlier versions on purpose** (no PU3, PEOU3, PI1,
  RES2, SAF1/2, PSA5, B5, B7, B11, G4) so that the data file stays comparable with
  Version 3.2/3.3 exports. Do not assume contiguous numbering in analysis syntax.
- Attention checks `ac1` (select 2) and `ac2` (select 5). Step 1 excludes only on
  failure of **both**; single failures are flagged and retained, and
  manipulation-check failures are retained in the primary analysis.
- `g3_wtp` = willingness-to-pay band (0 = Nothing ... 4 = More than 15%).
- `completion_time_sec` supports the speed screening rule (< 1/3 pilot median).
- **No email column.** The findings-summary address is collected after submission
  through a separate form (`POST /api/subscribe`) into its own `Contacts` tab, so
  it can never be joined to a response (plan Section 9.3).

## Instrument version 3.4 (aligned to Objectives & Analysis v2.4)

A shortened instrument: 41 Likert items instead of 65, eight constructs instead of
nine, 27 indicators and about 82 free parameters (4.9 responses per parameter at
n = 400).

| Change from v3.3 | Where |
|---|---|
| Constructs removed: PSI, TPR, GDS, PE, SN | `app.js`, schema |
| Items removed: TP5/TP6, PU3, PEOU3, PI1, SAF1/2, RES2, PEC3, B5, B7, B11, G4 | `app.js`, `index.html`, schema |
| PSA1/PSA3/PSA4 reworded (salience, comprehensibility, global); PSA6 reworded; PSA7 added as the technical-direction strength check | `PSA_ITEMS` |
| PSA6/PSA7 administered with the PSA block but scored as manipulation checks | `PSA_ITEMS`, schema |
| Manipulation checks H1/H2 moved to the end, after the dependent variables | `index.html` `s-checks` step |
| Section F referent: the checking shown in the scenario, not technology in general | `i18n.js` `f.instr` |
| Consent: 10-12 minutes, anonymity wording including the email form | `i18n.js` |

**Study links.**

```
https://<host>/                      main study, self-completed
https://<host>/?mode=enumerator      enumerator-administered (recorded as a control)
https://<host>/?phase=pilot          pilot sample, analysed separately
https://<host>/?lang=as              open in Assamese
```

**Quotas.** The admin page shows progress against the minimum coverage in plan
Section 9.2: rural or semi-urban >= 150, below graduate >= 200, never/rarely
scanned a QR code >= 100.

**Questionnaire.** `Paper3_Questionnaire_v3.4.docx` (workspace root) is the
authoritative instrument; the site mirrors its item order and wording. If an item
changes there, change it here too - the two must not drift.

## Fieldwork safeguards

Added after a 10-response QA pass, so that real respondents cannot lose or corrupt data.

| Risk | Handling |
|---|---|
| Repeated clicks on Submit wrote duplicate rows | The button disables on first click and a `submitted` flag blocks re-entry until the response is confirmed saved |
| Final page said "Thank You" before anything was saved | The page is now "Almost done" with "Press Submit to send your answers. Nothing has been saved yet" |
| Impossible B8 counts (0/0/0 from a parent, -2, 99, 1.5) | Whole numbers only, 0-15 each, and at least one child when B1 = parent |
| Mid-survey language switching mixed languages in one row | The toggle locks once the scenario is shown; `lang` and `lang_start` are both recorded |
| `?lang=as` ignored, choice forgotten | `?lang=` is honoured and the choice is remembered across reloads |
| Reload wiped all answers, no way back | Answers autosave as a draft and the survey resumes at the last step; a Back button is shown on every step except the first and the final two |
| No timing evidence | `completion_time_sec` and `scenario_time_sec` are recorded |
| Screen-outs left no trace | B1 = No posts to `/api/screenout`, recorded in a `Screenouts` tab so the exclusion flowchart is reportable without counting as a response |
| Public per-cell counts | `/api/assign` returns only the assigned cell, no counts |
| Free text used as a spreadsheet formula | Free text is capped (500 in the page, 1000 server-side) and a leading `= + - @` is neutralised |
| "Submit another response" shown to respondents | Shown only in enumerator mode |
| Enumerator reset reused the previous respondent's stimulus and left Submit disabled | The reset re-assigns a cell, rebuilds the stimulus, re-arms the button and releases the language lock |
| Back button unlocked the language and allowed re-reading the scenario | The language lock is permanent once the scenario has been shown, and Back is unavailable from the final-checks page |
| Scenario timing inflated on revisits | Measured on the first exit only, then frozen |
| Pilot rows counted with the main study | Cell counts, quotas and assignment use `phase = main` only; the pilot is reported beside it |

**Ethics reference.** Set `ETHICS_APPROVAL_REF` on the host and the consent page
prints it in place of the placeholder; the value is served by `GET /api/config`.

**Two extra tabs** live beside `Responses`: `Contacts` (findings-summary email
addresses, with no identifier) and `Screenouts` (B1 = No). Neither is included in
`/api/counts` or in cell balance.

## Language toggle (English / Assamese)

The participant page (`/`) offers a **language toggle** in the header (English ⇄
অসমীয়া). Participants can switch at any point; their answers are preserved
across the switch. The chosen language is stored in the `lang` column.

- All survey text, Likert items, and the four experimental stimuli are
  translated. The stimulus card title is frame-aware: technical cells show
  "VERIFIED PRODUCT RECORD", beneficiary cells show "VERIFIED VALUE RECORD".
- **Translation status:** the Assamese strings in `public/i18n.js` and
  `public/app.js` are **DRAFT translations** prepared for the build. They MUST
  be verified by a bilingual researcher and passed through the forward
  translation / blind back-translation / third-reviewer reconciliation
  procedure (design protocol §7.3) BEFORE fielding. To revise, edit the `as`
  block in `public/i18n.js` and the `as` fields in `public/app.js` — no code
  changes are needed.
- **Analysis note:** because respondents self-select their language, test
  configural/metric/scalar invariance across the `en` and `as` groups (in
  addition to across the four cells) and treat `lang` as a covariate.

## Deploying to a free server

Works on Render, Railway, Fly.io, Glitch, Cyclic, etc. Set `PORT` if needed
(most platforms inject it automatically).

**Recommended: use Google Sheets for persistent storage.** Free-tier servers
wipe local files on redeploy or idle-restart, so `data/responses.xlsx` alone is
not safe. The site can append every response to a Google Sheet (cloud copy that
survives restarts) **and** keep the local Excel file as a backup. See
`SETUP_GOOGLE_SHEETS.md` for the one-time setup (~10 minutes). Set these env vars:

- `GOOGLE_SERVICE_ACCOUNT_KEY` — the service-account key. On a cloud host,
  paste the **entire JSON content** of the key file into this variable
  (the code accepts raw JSON or a file path).
- `GOOGLE_SHEET_ID` — the spreadsheet ID.

**Current values for this project:**

| Variable | Value |
|---|---|
| `GOOGLE_SHEET_ID` | `1PKzd96paNlyvCGUJ7FgEj7a-DTgHIIlIJWsmcieTe3E` |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | the full JSON content of `service-account.json` (service account: `survey-writer@survey-writer-506118.iam.gserviceaccount.com`) |

> **Important:** the `Responses` tab's header must match the current schema. If a
> column is added to the instrument, the stored header goes stale and the server
> would otherwise refuse every append (silently, from the admin page's point of
> view). The server now repairs a stale header **automatically when the tab has
> zero response rows** (and still refuses when rows already exist, so data is
> never misaligned). If the tab already holds rows and you change the instrument,
> export them, clear `A1:ZZ`, then restart.

## Adding responses manually

Two ways, both land in the same Google Sheet and show up in the admin counts:

1. **Directly in the spreadsheet** — open the `Responses` tab and type a row under
   the existing header. `/api/counts` reads the sheet, so the admin page reflects
   it immediately (just reload the page).
2. **Upload a file on the admin page → “Manual entry — upload a responses file”.**
   Choose a `.xlsx` or `.csv`, optionally tick *check only, do not write*, then
   press **Merge into Google Sheet**. The server (`POST /api/import`) reads the
   file, matches columns **by header name** (so exports from any build work, and
   legacy short-key exports too), and appends the rows to the sheet.

Import rules:

- A row needs a `cell_id` of 1–4. `frame`, `cobrand` and `version` are derived
  from it, so an imported row cannot contradict its own condition.
- `submitted_at` is kept if present and a valid date, otherwise the import time
  is used. Blank cells stay blank.
- Rows already in the sheet (same `submitted_at` + `cell_id` + `completion_time_sec`)
  are skipped, so re-uploading the same file is harmless.
- The import is refused (nothing written) if the sheet cannot be read, so
  duplicates cannot slip in. The limit is 25 MB per file.
- Imported rows get a blank `id` (that column is the local Excel row number).

The spreadsheet: <https://docs.google.com/spreadsheets/d/1PKzd96paNlyvCGUJ7FgEj7a-DTgHIIlIJWsmcieTe3E/edit>

## Troubleshooting: admin page shows 0 responses

The admin page reads `GET /api/counts`, which reports **both** stores:

- `source: "google-sheet"` — the sheet is level with (or ahead of) the server file.
- `source: "server-file"` — the sheet is behind; the count comes from the server's
  own Excel file and a red **storage warning** is shown, naming the sheet error.

If you see the warning, responses were written to the server's local
`data/responses.xlsx` but **not** to the Google Sheet. That file is temporary on
a free host (wiped on restart/redeploy), so **download the Excel/CSV immediately**
from the admin page, then fix the sheet:

1. Check `GET /api/status` — it returns the sheet's `enabled`, `lastError` and
   `lastOkAt`.
2. Usually the stored header is stale after an instrument change. With zero data
   rows it now self-heals on the next submission; otherwise export the rows and
   clear the tab.
3. `POST /api/submit` now returns `sheetSaved: false` and logs
   `[submit] response N saved to the local file but NOT to the Google Sheet.`
   when the sheet write fails.

If those are not set, the site falls back to local Excel only (download the file
after each session to avoid losing data on a restart).

### Quick deploy on Render (recommended, free)
1. Push this folder to a GitHub repository.
2. Create a free account at https://render.com.
3. **New → Web Service** → connect your GitHub repo.
4. Build command: `npm install` · Start command: `node server.js`.
5. Under **Environment**, add:
   - `GOOGLE_SERVICE_ACCOUNT_KEY` = the full JSON key content
   - `GOOGLE_SHEET_ID` = your spreadsheet ID
6. **Create Web Service**. You get a public URL like `https://your-app.onrender.com`.
   - Free tier spins down after ~15 min idle, then auto-wakes on the first request.

### Quick deploy on Glitch (simpler, free)
1. Create a free account at https://glitch.com.
2. **New Project → Import from GitHub** (or upload the files).
3. Add the two env vars in **Project → .env**.
4. The app runs at `https://your-project.glitch.me`.
   - Free tier sleeps after ~5 min idle and has a monthly usage limit.

## Before fielding

- The co-brand cells (2 and 4) already display the **official FSSAI and AGMARK
  logos** (sourced from `fssai.gov.in` and `uxdt.nic.in`, stored in
  `public/logos/`). Confirm they render correctly in the admin previews.
- The consent section uses the institutional contact details
  (`aditya@awu.ac.in` / `+91-9707156777`). Replace the ethics-approval
  reference placeholder (`[approval reference: ____________]`) with the real
  reference number before fielding.
- Run the pilot (n = 50) and check: manipulation-check pass rate > 80%,
  attention-check pass rate, median completion time (for the speed rule),
  and that all 4 cells are receiving traffic.
