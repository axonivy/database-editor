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

test('undo / redo', async ({ page, browserName }) => {
  await expect(editor.main.toolbar.undo).toBeDisabled();
  await expect(editor.main.toolbar.redo).toBeDisabled();
  await editor.main.table.row(1).locator.click();
  await expect(editor.main.table.rows).toHaveCount(3);
  await editor.main.control.delete.click();
  await expect(editor.main.table.rows).toHaveCount(2);

  await expect(editor.main.toolbar.undo).toBeEnabled();
  await editor.main.toolbar.undo.click();
  await expect(editor.main.table.rows).toHaveCount(3);
  await expect(editor.main.toolbar.undo).toBeDisabled();

  await expect(editor.main.toolbar.redo).toBeEnabled();
  await editor.main.toolbar.redo.click();
  await expect(editor.main.table.rows).toHaveCount(2);
  await expect(editor.main.toolbar.redo).toBeDisabled();

  await page.keyboard.press('ControlOrMeta+Z');
  await expect(editor.main.table.rows).toHaveCount(3);

  await page.keyboard.press(browserName === 'webkit' ? 'ControlOrMeta+Shift+Z' : 'ControlOrMeta+Y');
  await expect(editor.main.table.rows).toHaveCount(2);
});
