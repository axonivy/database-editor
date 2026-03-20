import type { Locator, Page } from '@playwright/test';
import { Table } from './Table';

export class ResultPage {
  readonly locator: Locator;
  readonly header: Locator;
  readonly table: Table;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.getByRole('region', { name: 'Result' });
    this.table = new Table(this.locator);
    this.header = this.locator.getByRole('heading', { level: 3 });
  }
}
