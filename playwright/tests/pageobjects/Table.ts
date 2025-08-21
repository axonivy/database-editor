import { expect, type Locator, type Page } from '@playwright/test';

export class Table {
  readonly page: Page;
  readonly locator: Locator;
  readonly headers: Locator;
  readonly rows: Locator;

  constructor(page: Page, parent: Locator) {
    this.page = page;
    this.locator = parent.locator('.ui-table');
    this.headers = this.locator.locator('.ui-table-head');
    this.rows = this.locator.locator('.ui-table-row');
  }

  expectHeaders = async (...headers: Array<string>) => {
    await expect(this.headers).toHaveText(headers);
  };
}
