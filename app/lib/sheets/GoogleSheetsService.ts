import { google } from "googleapis";
import { sheetsConfig } from "@/app/lib/env";

export abstract class GoogleSheetsService {
  protected abstract readonly sheetName: string;

  protected async appendRow(values: string[]): Promise<void> {
    if (!sheetsConfig.success) {
      throw new Error("Google Sheets is not configured");
    }

    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID } =
      sheetsConfig.data;

    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range: `${this.sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
  }
}
