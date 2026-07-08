// e2e/helpers/sheets.ts
import { google } from "googleapis";

export async function getLastSheetRow(
  spreadsheetId: string,
  sheetName: string,
) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:B`,
  });
  const rows = res.data.values ?? [];
  return rows[rows.length - 1];
}
