import { GoogleSheetsService } from "./GoogleSheetsService";

export interface DemoRow {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  teamSize: string;
  currentSearch: string;
  submittedAt: string;
}

export class DemoSheetService extends GoogleSheetsService {
  // Must match the exact tab name in your Google Spreadsheet
  protected readonly sheetName = "RequestDemo";

  /**
   * Appends a demo request row with columns:
   * [First Name, Last Name, Email, Company, Team Size, Current Workflow, Submitted At]
   */
  async append(data: DemoRow): Promise<void> {
    await this.appendRow([
      data.firstName,
      data.lastName,
      data.email,
      data.company,
      data.teamSize,
      data.currentSearch,
      data.submittedAt,
    ]);
  }
}
