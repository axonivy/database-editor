import type { Locator, Page } from '@playwright/test';
import { Select } from './Select';

export class DataSourcePage {
  readonly locator: Locator;
  readonly typeSelection: Locator;
  readonly databaseSelect: Select;
  readonly contentGrid: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.data-source-page');
    this.contentGrid = this.locator.locator('.import-grid');
    this.typeSelection = this.locator.locator('.source-group');
    this.databaseSelect = new Select(page, this.contentGrid, { nth: 0 });
  }
}
