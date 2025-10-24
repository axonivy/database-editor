import type { Locator, Page } from '@playwright/test';

export class TableSelectionPage {
  readonly locator: Locator;
  readonly tableSelect: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.database-editor-import-page-table-selection');
    this.tableSelect = parent.locator('.table-button');
  }
}
