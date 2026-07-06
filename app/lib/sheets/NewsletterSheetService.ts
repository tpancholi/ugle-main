import { GoogleSheetsService } from "./GoogleSheetsService";

export interface NewsletterRow {
  email: string;
  subscribedAt: string;
}

export class NewsletterSheetService extends GoogleSheetsService {
  // Must match the exact tab name in your Google Spreadsheet
  protected readonly sheetName = "Newsletter";

  /**
   * Appends a newsletter subscriber row with columns: [Email, Subscribed At]
   */
  async append(data: NewsletterRow): Promise<void> {
    await this.appendRow([data.email, data.subscribedAt]);
  }
}
