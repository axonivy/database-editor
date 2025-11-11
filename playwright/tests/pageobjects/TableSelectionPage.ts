import type { Locator, Page } from '@playwright/test';

export class TableSelectionPage {
  readonly locator: Locator;
  readonly tableList: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.database-table-selection');
    this.tableList = parent.locator('.selection-list-container');
  }
}
