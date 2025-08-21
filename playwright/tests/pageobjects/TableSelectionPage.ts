import type { Locator, Page } from '@playwright/test';
import { MultiSelect } from './MultiSelect';

export class TableSelectionPage {
  readonly locator: Locator;
  readonly tableSelect: MultiSelect;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.table-selection-page');
    this.tableSelect = new MultiSelect(page, this.locator);
  }
}
