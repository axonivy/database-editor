import type { Locator, Page } from '@playwright/test';
import { Select } from './Select';

export class DataSourcePage {
  readonly locator: Locator;
  readonly typeSelection: Locator;
  readonly projectSelection: Select;
  readonly databaseSelect: Select;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.database-editor-import-page-data-source');
    this.typeSelection = this.locator.locator('.source-group');
    this.projectSelection = new Select(page, this.locator, { nth: 0 });
    this.databaseSelect = new Select(page, this.locator, { nth: 1 });
  }
}
