import type { Locator, Page } from '@playwright/test';

export class TableSelectionPage {
  readonly locator: Locator;
  readonly tableSelect: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.table-selection-page');
    this.tableSelect = parent.locator('.table-button');
  }
}
