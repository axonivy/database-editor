import { expect, test } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

test('table', async ({ page }) => {
  const editor = await DatabaseEditor.openMock(page);
  const add = editor.main.control.add;
  await add.trigger.click();
  await add.name.locator.fill('invalid-key');
  await expect(add.create).toBeEnabled();
  await add.create.click();
  await expect(editor.main.table.locator.locator('.ui-message-row').first()).toHaveText('Database invalid-key contains invalid characters');
});

test('detail', async ({ page }) => {
  const editor = await DatabaseEditor.openMock(page);
  const add = editor.main.control.add;
  await add.trigger.click();
  await add.name.locator.fill('invalid-key');
  await expect(add.create).toBeEnabled();
  await add.create.click();
  await editor.main.table.row(4).locator.click();
  await (await editor.detail.general.key.message()).expectToBeError('Database invalid-key contains invalid characters');
});
