import { expect, test } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
  await editor.page.evaluate(() => {
    localStorage.setItem('sqlExecutor:last-executed:::project1-name:database0', JSON.stringify('SELECT * FROM cars'));
  });
  await editor.main.table.row(0).locator.click();
});

test('open dialog shows database info and last query', async () => {
  const dialog = await editor.main.openSqlExecutorDialog();
  await dialog.textarea.fill('SELECT * FROM cars');
  await dialog.executeButton.click();

  await editor.page.keyboard.press('Escape');
  await expect(dialog.locator).toBeHidden();

  const reopenedDialog = await editor.main.openSqlExecutorDialog();

  await expect(reopenedDialog.lastExecutedSqlouput).toHaveText('SELECT * FROM cars');
  await expect(reopenedDialog.locator.getByText('Database Configuration: database0')).toBeVisible();
});

test('execute sql updates readonly display and shows result table', async () => {
  const dialog = await editor.main.openSqlExecutorDialog();

  await dialog.textarea.clear();
  await expect(dialog.executeButton).toBeDisabled();

  await dialog.textarea.fill('SELECT * FROM cars');
  await dialog.executeButton.click();

  await dialog.locator.locator('span').getByText('SELECT * FROM cars').click();
  await expect(dialog.resultTable()).toBeVisible();
  await expect(dialog.resultHeader(0)).toHaveText('id');
  await expect(dialog.resultHeader(1)).toHaveText('name');
  await expect(dialog.resultHeader(2)).toHaveText('street');
  await expect(dialog.resultCell(0, 0)).toHaveText('1');
  await expect(dialog.resultCell(0, 1)).toHaveText('Marie');
  await expect(dialog.resultCell(0, 2)).toHaveText('bakerstreet');
});

test('select table prefills textarea and shows table content', async () => {
  const dialog = await editor.main.openSqlExecutorDialog();
  await expect(dialog.tableCombobox).toBeEnabled();
  await dialog.tableCombobox.click();
  await editor.page.getByRole('option', { name: 'Users-002' }).click();

  await expect(dialog.textarea).toHaveValue('SELECT * FROM Users-002');
  await expect(dialog.resultTable()).toBeVisible();
  await expect(dialog.resultHeader(0)).toHaveText('id');
  await expect(dialog.resultHeader(1)).toHaveText('name');
  await expect(dialog.resultCell(0, 0)).toHaveText('1');
});
