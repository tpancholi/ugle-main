import { GoogleSheetsService } from "./GoogleSheetsService";

export interface EducationRow {
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  role: string;
  proofUrl?: string;
  submittedAt: string;
}

export class EducationSheetService extends GoogleSheetsService {
  // Must match the exact tab name in your Google Spreadsheet
  protected readonly sheetName = "EducationalPack";

  /**
   * Appends an education application row with columns:
   * [First Name, Last Name, Email, Institution, Role, Proof URL, Submitted At]
   */
  async append(data: EducationRow): Promise<void> {
    await this.appendRow([
      data.firstName,
      data.lastName,
      data.email,
      data.institution,
      data.role,
      data.proofUrl || "",
      data.submittedAt,
    ]);
  }
}
