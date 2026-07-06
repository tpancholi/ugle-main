import { GoogleSheetsService } from "./GoogleSheetsService";

export interface EarlyAccessRow {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  os: string;
  submittedAt: string;
}

export class EarlyAccessSheetService extends GoogleSheetsService {
  // Must match the exact tab name in your Google Spreadsheet
  protected readonly sheetName = "EarlyAccess";

  /**
   * Appends an early access row with columns:
   * [First Name, Last Name, Email, Phone, OS, Submitted At]
   */
  async append(data: EarlyAccessRow): Promise<void> {
    await this.appendRow([
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.os,
      data.submittedAt,
    ]);
  }
}
