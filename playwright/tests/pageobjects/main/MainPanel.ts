import { expect, type Locator, type Page } from '@playwright/test';
import { Control } from './Control';
import { SqlExecutorDialog } from './SqlExecutorDialog';
import { Table } from './Table';
import { Toolbar } from './Toolbar';

export class MainPanel {
  readonly locator: Locator;
  readonly toolbar: Toolbar;
  readonly control: Control;
  readonly table: Table;

  constructor(readonly page: Page) {
    this.locator = page.locator('#database-editor-main');
    this.toolbar = new Toolbar(page, this.locator);
    this.control = new Control(page, this.locator);
    this.table = new Table(this.locator);
  }

  public async openSqlExecutorDialog() {
    await this.page.getByRole('button', { name: 'SQL Executor' }).click();
    const dialog = new SqlExecutorDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }
}
