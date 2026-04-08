import { expect, type Locator, type Page } from '@playwright/test';
import { Control } from './Control';
import { SqlQueryTesterDialog } from './SqlQueryTesterDialog';
import { Table } from './Table';
import { Toolbar } from './Toolbar';

export class MainPanel {
  readonly locator: Locator;
  readonly toolbar: Toolbar;
  readonly control: Control;
  readonly table: Table;
  readonly button: Locator;

  constructor(readonly page: Page) {
    this.locator = page.locator('.database-editor-main-panel');
    this.toolbar = new Toolbar(page, this.locator);
    this.control = new Control(page, this.locator);
    this.table = new Table(this.locator.locator('.database-editor-table-field'));
    this.button = page.getByRole('button', { name: 'SQL Query', exact: true });
  }

  public async openSqlQueryTesterDialog() {
    await this.button.click();
    const dialog = new SqlQueryTesterDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }
}
