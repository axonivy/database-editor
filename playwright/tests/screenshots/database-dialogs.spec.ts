import { test } from '@playwright/test';
import { DatabaseEditor } from '../pageobjects/DatabaseEditor';
import { screenshotElement } from './screenshot-util';

test('sql query tester screenshot', async ({ page }) => {
  const editor = await DatabaseEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  const dialog = await editor.main.openSqlQueryTesterDialog();
  await dialog.textarea.fill('SELECT * FROM USERS');
  await dialog.executeButton.click();
  await dialog.resultTable().waitFor();
  await screenshotElement(dialog.locator, 'dialog-generate-rest-classes');
});
