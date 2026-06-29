import { type Locator, type Page } from '@playwright/test';

export class SqlQueryTesterDialog {
  readonly locator: Locator;
  readonly textarea: Locator;
  readonly executeButton: Locator;
  readonly executedSqlInput: Locator;
  readonly tableCombobox: Locator;

  constructor(readonly page: Page) {
    this.locator = page.getByRole('dialog', { name: 'SQL Query', exact: true });

    this.textarea = page.locator('textarea');
    this.executeButton = page.getByRole('button', { name: 'Execute' });
    this.executedSqlInput = page.locator('input[readonly]');
    this.tableCombobox = page.getByRole('combobox').first();
  }

  async executeIfDialogVisible(sql: string) {
    if (!(await this.locator.isVisible())) return;
    await this.textarea.fill(sql);
    await this.executeButton.click();
  }

  resultTable() {
    return this.locator.locator('table');
  }

  resultCell(row: number, col: number) {
    return this.resultTable().locator('tbody tr').nth(row).locator('td').nth(col);
  }

  resultHeader(col: number) {
    return this.resultTable().locator('thead th').nth(col);
  }
}
