import type { Locator, Page } from '@playwright/test';
import { Control } from './Control';
import { Table } from './Table';
import { Toolbar } from './Toolbar';

export class MainPanel {
  readonly locator: Locator;
  readonly toolbar: Toolbar;
  readonly control: Control;
  readonly table: Table;

  constructor(page: Page) {
    this.locator = page.locator('.database-editor-main-panel');
    this.toolbar = new Toolbar(page, this.locator);
    this.control = new Control(page, this.locator);
    this.table = new Table(this.locator.locator('.database-editor-table-field'));
  }
}
