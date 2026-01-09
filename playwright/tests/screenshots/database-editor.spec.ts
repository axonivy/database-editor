import { test } from '@playwright/test';
import { DatabaseEditor } from '../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test('validation', async () => {
  await editor.takeScreenshot('database-editor.png');
});
