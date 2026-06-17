/**
 * Tokenable waitlist → Google Sheets
 *
 * Setup:
 * 1. Create a Google Sheet (row 1 headers: Submitted At | Name | Email | Telegram ID | Source)
 * 2. Extensions → Apps Script → paste this file → Save
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL into .env:
 *    NEXT_PUBLIC_WAITLIST_SHEETS_URL=https://script.google.com/macros/s/.../exec
 * 5. Set WAITLIST_SHEETS_SECRET below and the same value in .env:
 *    NEXT_PUBLIC_WAITLIST_SHEETS_SECRET=your-random-string
 *
 * If you already have a sheet without "Telegram ID", insert a column D with that header.
 */

const SHEETS_SECRET = "Cv2GkIIZtvorvY1ZZcsXmLGmKiMFsZosd70RDaGe";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SHEETS_SECRET) {
      return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const telegram = String(body.telegram || "").trim();
    if (!name || !email) {
      return jsonResponse({ ok: false, error: "Missing name or email" }, 400);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Submitted At", "Name", "Email", "Telegram ID", "Source"]);
    }

    sheet.appendRow([new Date(), name, email, telegram, "tokenable.io"]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function jsonResponse(payload, _status) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
