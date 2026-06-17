/**
 * Tokenable waitlist → Google Sheets
 *
 * Setup:
 * 1. Set SPREADSHEET_ID below to your sheet ID (from the spreadsheet URL).
 * 2. Extensions → Apps Script on that sheet → paste this file → Save
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL into .env / Netlify:
 *    WAITLIST_SHEETS_URL=https://script.google.com/macros/s/.../exec
 * 5. SHEETS_SECRET must match WAITLIST_SHEETS_SECRET
 */

const SPREADSHEET_ID = "1nAzbuEc47-oxATc29D4Q9Z-gpJNjSP_h-OY7X0yPykg";
const SHEETS_SECRET = "Cv2GkIIZtvorvY1ZZcsXmLGmKiMFsZosd70RDaGe";

function doGet() {
  return jsonResponse({ ok: true, message: "Tokenable waitlist endpoint ready" });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "No post data" });
    }

    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SHEETS_SECRET) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const telegram = String(body.telegram || "").trim();
    if (!name || !email) {
      return jsonResponse({ ok: false, error: "Missing name or email" });
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Submitted At", "Name", "Email", "Telegram ID", "Source"]);
    }

    sheet.appendRow([new Date(), name, email, telegram, "tokenable.io"]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
