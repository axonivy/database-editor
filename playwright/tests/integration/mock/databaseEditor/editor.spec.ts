import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test('readonly', async () => {
  await expect(editor.main.control.locator).toBeVisible();
  editor = await DatabaseEditor.openMock(editor.page, { readonly: true });
  await expect(editor.main.control.locator).toBeHidden();
});

test('focus jumps', async () => {
  await expect(editor.main.toolbar.locator).not.toBeFocused();
  await editor.page.keyboard.press('1');
  await expect(editor.main.toolbar.locator).toBeFocused();
  await editor.page.keyboard.press('2');
  await expect(editor.main.locator.locator('.database-editor-table-field')).toBeFocused();
  await editor.page.keyboard.press('3');
  await expect(editor.detail.toolbar).toBeFocused();
});
