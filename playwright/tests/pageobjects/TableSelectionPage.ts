import type { Locator, Page } from '@playwright/test';
import { MultiSelect } from './MultiSelect';

export class TableSelectionPage {
  readonly locator: Locator;
  readonly tableSelect: MultiSelect;
  readonly contentGrid: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.table-selection-page');
    this.contentGrid = this.locator.locator('.import-grid');
    this.tableSelect = new MultiSelect(page, this.contentGrid);
  }
}
