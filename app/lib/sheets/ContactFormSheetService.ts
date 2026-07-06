import { GoogleSheetsService } from "./GoogleSheetsService";

export interface ContactFormRow {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  seats: string;
  usecase: string;
  submittedAt: string;
}

export class ContactFormSheetService extends GoogleSheetsService {
  protected readonly sheetName = "ContactSales";

  async append(data: ContactFormRow): Promise<void> {
    await this.appendRow([
      data.firstName,
      data.lastName,
      data.email,
      data.company,
      data.seats,
      data.usecase,
      data.submittedAt,
    ]);
  }
}
