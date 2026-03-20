import type { Locator, Page } from '@playwright/test';
import { Table } from './Table';

export class CreationPage {
  readonly locator: Locator;
  readonly namespace: Locator;
  readonly table: Table;
  readonly attributeButton: Locator;
  readonly attributeTable: Table;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.getByRole('region', { name: 'Options' });
    this.table = new Table(this.locator);
    this.namespace = parent.getByLabel('Namespace*');
    this.attributeButton = this.locator.getByRole('button', { name: 'Attributes' });
    this.attributeTable = new Table(page.locator('.ui-popover-content'));
  }
}
