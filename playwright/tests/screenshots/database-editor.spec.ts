import { test } from '@playwright/test';
import { DatabaseEditor } from '../pageobjects/DatabaseEditor';
import { screenshot } from './screenshot-util';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test('screenshot', async ({ page }) => {
  await editor.main.table.row(0).locator.click();
  await screenshot(page, 'database-editor.png');
});
