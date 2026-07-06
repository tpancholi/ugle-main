import { google } from "googleapis";
import env from "@/app/lib/env";

export abstract class GoogleSheetsService {
  // Each subclass declares which tab name it writes to
  protected abstract readonly sheetName: string;

  /**
   * Appends a single row of values to this service's sheet tab.
   * Creates a new Google Auth client per call — safe for serverless/edge
   * environments where persistent connections are not reliable.
   */
  protected async appendRow(values: string[]): Promise<void> {
    const auth = new google.auth.JWT({
      email: env.GOOGLE_CLIENT_EMAIL,
      key: env.GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SPREADSHEET_ID,
      // A1 notation: <SheetName>!A1 tells the API which tab to target
      range: `${this.sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
  }
}
