import type { Locator, Page } from '@playwright/test';
import { Table } from './Table';

export class CreationPage {
  readonly locator: Locator;
  readonly table: Table;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.creation-page');
    this.table = new Table(page, this.locator);
  }
}
