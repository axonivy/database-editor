import { expect, type Locator, type Page } from '@playwright/test';

export class SqlQueryTester {
  readonly trigger: Locator;
  readonly dialog: Locator;
  readonly textarea: Locator;
  readonly executeButton: Locator;
  readonly executedSqlInput: Locator;
  readonly tableCombobox: Locator;

  constructor(page: Page, parent: Locator) {
    this.trigger = parent.getByRole('button', { name: 'SQL Query', exact: true });
    this.dialog = this.dialog = page.getByRole('dialog', { name: 'SQL Query', exact: true });
    this.textarea = this.dialog.locator('textarea');
    this.executeButton = this.dialog.getByRole('button', { name: 'Execute' });
    this.executedSqlInput = this.dialog.locator('input[readonly]');
    this.tableCombobox = this.dialog.getByRole('combobox').first();
  }

  async open() {
    await this.trigger.click();
    await expect(this.dialog).toBeVisible();
  }

  async executeIfDialogVisible(sql: string) {
    if (!(await this.dialog.isVisible())) return;
    await this.textarea.fill(sql);
    await this.executeButton.click();
  }

  resultTable() {
    return this.dialog.locator('table');
  }

  resultCell(row: number, col: number) {
    return this.resultTable().locator('tbody tr').nth(row).locator('td').nth(col);
  }

  resultHeader(col: number) {
    return this.resultTable().locator('thead th').nth(col);
  }
}
