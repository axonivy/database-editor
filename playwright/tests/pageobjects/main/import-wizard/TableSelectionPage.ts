import type { Locator, Page } from '@playwright/test';

export class TableSelectionPage {
  readonly locator: Locator;
  readonly tableList: Locator;
  readonly availableTables: Locator;
  readonly selectedTables: Locator;

  constructor(_page: Page, parent: Locator) {
    this.locator = parent.getByRole('region', { name: 'Tables' });
    this.tableList = this.locator.getByRole('list');
    this.availableTables = this.locator.getByRole('list', { name: 'Choose the tables you want to select' });
    this.selectedTables = this.locator.getByRole('list', { name: 'Your selection' });
  }
}
