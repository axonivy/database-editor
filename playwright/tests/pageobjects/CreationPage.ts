import type { Locator, Page } from '@playwright/test';
import { Table } from './Table';

export class CreationPage {
  readonly locator: Locator;
  readonly namespace: Locator;
  readonly table: Table;
  readonly attributeButton: Locator;
  readonly attributeTable: Table;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.creation-page');
    this.table = new Table(page, '.table-creation');
    this.namespace = parent.getByLabel('Namespace*');
    this.attributeButton = this.locator.locator('.attribute-selection-trigger');
    this.attributeTable = new Table(page, '.attribute-selection-table');
  }
}
