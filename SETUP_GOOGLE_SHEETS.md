# Setting up Google Sheets storage (one-time, ~10 minutes)

The survey site can append every response to a Google Sheet. Because the data
lives in the cloud, it **survives server restarts and redeploys** — solving the
free-tier ephemeral-storage problem. The local Excel file (`data/responses.xlsx`)
is kept as an automatic backup.

You need a Google account (you have one). Follow these steps once:

---

## Step 1 — Create a Google Cloud project

1. Go to https://console.cloud.google.com and sign in.
2. Click the project dropdown (top-left) → **New Project**.
3. Name it e.g. `paper3-survey` → **Create**.
4. Make sure the new project is selected in the dropdown.

## Step 2 — Enable the Google Sheets API

1. Go to https://console.cloud.google.com/apis/library/sheets.googleapis.com
2. Click **Enable**.

## Step 3 — Create a service account

1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts
2. Click **+ Create service account**.
3. Name it e.g. `survey-writer` → **Create and continue**.
4. Skip the optional roles → **Done**.

## Step 4 — Download the JSON key

1. On the service accounts list, click the **email** of `survey-writer`.
2. Go to the **Keys** tab → **Add key** → **Create new key**.
3. Choose **JSON** → **Create**. A file like `paper3-survey-xxxx.json` downloads.
4. Move that file into the project folder, e.g.:
   `D:\openwork\Quantative Major Paper\Paper3_SurveySite\service-account.json`
   (Keep it private — never commit it to git.)

## Step 5 — Create the spreadsheet and share it

1. Go to https://sheets.new — a new spreadsheet opens.
2. Rename the first tab to **Responses** (double-click the tab name).
3. Copy the **spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit`
4. Click **Share** (top-right) → paste the service account email
   (the `client_email` value inside the JSON key file, ends in
   `@paper3-survey.iam.gserviceaccount.com`) → set permission to
   **Editor** → uncheck "Notify people" → **Share**.

## Step 6 — Configure the server

Set two environment variables before starting the server:

| Variable | Value |
|----------|-------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Full path to the JSON key file, e.g. `D:\openwork\Quantative Major Paper\Paper3_SurveySite\service-account.json` |
| `GOOGLE_SHEET_ID` | The spreadsheet ID from Step 5 |

**Locally (PowerShell):**
```powershell
$env:GOOGLE_SERVICE_ACCOUNT_KEY = "D:\openwork\Quantative Major Paper\Paper3_SurveySite\service-account.json"
$env:GOOGLE_SHEET_ID = "PASTE_SPREADSHEET_ID_HERE"
npm start
```

**On Render/Railway/Fly:** add both as environment variables in the dashboard.

## Step 7 — Verify

1. Start the server and submit one test response.
2. Open your Google Sheet — the header row and your test row should appear.
3. The server console should print `[sheets] enabled for spreadsheet ...`.

---

## How it behaves

- Every submission appends a row to **both** Google Sheets and the local Excel file.
- If Google Sheets is unreachable, the response is still saved locally (no data lost);
  the server logs `[sheets] append failed: ...`.
- If the env vars are missing, Sheets is disabled and the site works exactly as before.