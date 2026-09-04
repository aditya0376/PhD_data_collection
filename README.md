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
- **Instrument:** Version 3.2 (TAM3) — 67 Likert items across B/C/E/F/G blocks.

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
| `/api/export`    | Download `responses.xlsx`                            |
| `/api/export.csv`| Download `responses.csv`                             |

## Excel / Google Sheet columns (v3.2, 92 columns)

`id, submitted_at, cell_id, frame, cobrand, completion_time_sec,
b1, b2, b3, b4, b5, b6, b7, b8_1, b8_2, b8_3, b9, b10, b11,
pec1..pec3, gds1..gds3, tpr1..tpr3, mv1..mv3,
dvc1..dvc4, ac1, saf1..saf4,
psa1..psa6, tp1..tp6, pf1..pf3, psi1..psi5,
pu1..pu4, peou1..peou4, itu1..itu3, pe1..pe3, sn1..sn3, ac2,
pi1..pi4, res1..res4, g3_wtp, g4_reason, g5_comment,
mc_a, mc_b, email`

- `frame` = 0 (Technical) / 1 (Beneficiary); `cobrand` = 0 (Absent) / 1 (Present).
- `b8_1 / b8_2 / b8_3` = number of children aged 1–5 / 6–10 / 11–16 (B8).
- `mc_a` / `mc_b` are the manipulation checks (Section H, recorded, not blocking).
- `ac1` (select "Disagree" = 2) and `ac2` (select "Strongly agree" = 5) are
  instructed-response attention checks (recorded, not blocking).
- `saf2` is reverse-coded in analysis.
- `g3_wtp` = willingness-to-pay band (0 = Nothing … 4 = More than 15%);
  `g4_reason` is shown only when `g3_wtp` = 0.
- `completion_time_sec` supports the speed screening rule (< 1/3 pilot median → exclude).

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

> **Important:** the `Responses` tab must be empty (or its header must match the
> v3.2 schema) before the first submission. The server refuses to append if the
> stored header does not match the current instrument schema, to prevent
> misaligned rows. If you change the instrument, clear the `Responses` tab
> (all columns, e.g. `A1:ZZ500`) before restarting.

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