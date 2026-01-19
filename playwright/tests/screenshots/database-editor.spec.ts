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
