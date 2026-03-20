import { expect, type Locator } from '@playwright/test';

export class Table {
  readonly locator: Locator;
  readonly headers: Locator;
  readonly rows: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('.ui-table-root');
    this.headers = this.locator.locator('.ui-table-head');
    this.rows = this.locator.locator('.ui-table-row');
  }

  expectHeaders = async (...headers: Array<string>) => {
    await expect(this.headers).toHaveText(headers);
  };
}
