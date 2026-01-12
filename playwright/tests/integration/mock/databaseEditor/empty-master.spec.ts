import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test('empty', async () => {
  const emptyPanelMessage = editor.main.locator.locator('.ui-panel-message').locator('p');
  await expect(emptyPanelMessage).toBeHidden();

  await editor.main.table.row(0).locator.click();
  const rowsCount = await editor.main.table.rows.count();
  for (let i = 0; i < rowsCount; i++) {
    await editor.main.control.delete.click();
  }
  await expect(emptyPanelMessage).toHaveText('Add your first Database Connection to get started');

  await editor.main.locator.getByRole('button', { name: 'Add Database Connection' }).click();
  await expect(editor.main.control.add.locator).toBeVisible();

  await editor.main.control.add.cancel.click();
  await editor.main.locator.getByRole('button', { name: 'Generate' }).click();
  await expect(editor.main.control.importDialog.locator).toBeVisible();
});
