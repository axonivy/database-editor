import { expect, test } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
});

test('open dialog shows database info and last query', async () => {
  const { sqlQueryTester } = editor.main.control;
  await sqlQueryTester.open();

  await expect(sqlQueryTester.dialog.getByText('Database Configuration: database0')).toBeVisible();
  await expect(sqlQueryTester.textarea).toHaveValue('SELECT * FROM cars');
  await expect(sqlQueryTester.executeButton).toBeEnabled();
});

test('execute sql updates readonly input and shows result table', async () => {
  const { sqlQueryTester } = editor.main.control;
  await sqlQueryTester.open();

  await sqlQueryTester.textarea.clear();
  await expect(sqlQueryTester.executeButton).toBeDisabled();

  await sqlQueryTester.textarea.fill('SELECT * FROM cars');
  await sqlQueryTester.executeButton.click();

  await expect(sqlQueryTester.executedSqlInput).toHaveValue('SELECT * FROM cars');
  await expect(sqlQueryTester.resultTable()).toBeVisible();
  await expect(sqlQueryTester.resultHeader(0)).toHaveText('id');
  await expect(sqlQueryTester.resultHeader(1)).toHaveText('name');
  await expect(sqlQueryTester.resultHeader(2)).toHaveText('street');
  await expect(sqlQueryTester.resultCell(0, 0)).toHaveText('1');
  await expect(sqlQueryTester.resultCell(0, 1)).toHaveText('Marie');
  await expect(sqlQueryTester.resultCell(0, 2)).toHaveText('bakerstreet');
});

test('select table prefills textarea and shows table content', async () => {
  const { sqlQueryTester } = editor.main.control;
  await sqlQueryTester.open();
  await sqlQueryTester.tableCombobox.click();
  await editor.page.getByRole('option', { name: 'cars' }).click();

  await expect(sqlQueryTester.textarea).toHaveValue('SELECT * FROM cars');
  await expect(sqlQueryTester.resultTable()).toBeVisible();
  await expect(sqlQueryTester.resultHeader(0)).toHaveText('id');
  await expect(sqlQueryTester.resultHeader(1)).toHaveText('name');
  await expect(sqlQueryTester.resultCell(0, 0)).toHaveText('1');
});
