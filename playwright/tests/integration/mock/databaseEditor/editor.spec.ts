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
