import { test } from '@playwright/test';
import { DatabaseEditor } from '../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test('screenshot', async () => {
  await editor.main.table.row(0).locator.click();
  await editor.takeScreenshot('database-editor.png');
});

test('sql query tester screenshot', async () => {
  await editor.main.table.row(0).locator.click();
  const { sqlQueryTester } = editor.main.control;
  await sqlQueryTester.open();
  await sqlQueryTester.textarea.fill('SELECT * FROM cars');
  await sqlQueryTester.executeButton.click();
  await sqlQueryTester.resultTable().waitFor();
  await editor.takeScreenshot('sql-query-tester.png');
});
