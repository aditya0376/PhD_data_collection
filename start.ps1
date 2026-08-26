# Starts the survey server with Google Sheets storage enabled.
# Run:  powershell -ExecutionPolicy Bypass -File start.ps1
$env:GOOGLE_SERVICE_ACCOUNT_KEY = "D:\openwork\Quantative Major Paper\Paper3_SurveySite\service-account.json"
$env:GOOGLE_SHEET_ID = "1PKzd96paNlyvCGUJ7FgEj7a-DTgHIIlIJWsmcieTe3E"
node server.js