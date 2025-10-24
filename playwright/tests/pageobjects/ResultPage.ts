import type { Locator, Page } from '@playwright/test';
import { Table } from './Table';

export class ResultPage {
  readonly locator: Locator;
  readonly header: Locator;
  readonly table: Table;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.database-editor-import-page-creation-result');
    this.table = new Table(page, '.table-errors');
    this.header = parent.locator('h3');
  }
}
