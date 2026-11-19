import { expect, test } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

const validationUrl = 'https://developer.axonivy.com/doc/14.0/en/reference/validation/codes/ivy.database.key-not-unique.html';

test('table', async ({ page }) => {
  const editor = await DatabaseEditor.openMock(page);
  const add = editor.main.control.add;
  await add.trigger.click();
  await add.name.locator.fill('invalid-key');
  await expect(add.create).toBeEnabled();
  await add.create.click();
  const validationMessages = editor.main.table.locator.locator('.ui-message-row');
  await expect(validationMessages).toHaveCount(2);
  await expect(validationMessages.first()).toHaveText('Database invalid-key contains invalid characters');

  const referenceLink = validationMessages
    .first()
    .getByRole('button', { name: 'ivy.database.key-not-unique' });
  await expect(referenceLink).toBeVisible();
  await expect(validationMessages.nth(1).getByRole('button')).toHaveCount(0);

  const openUrlAction = page.waitForEvent('console', {
    predicate: message => message.type() === 'log' && message.text().includes('"actionId":"openUrl"')
  });
  await referenceLink.click();
  expect((await openUrlAction).text()).toContain(validationUrl);
});

test('detail', async ({ page }) => {
  const editor = await DatabaseEditor.openMock(page);
  const add = editor.main.control.add;
  await add.trigger.click();
  await add.name.locator.fill('invalid-key');
  await expect(add.create).toBeEnabled();
  await add.create.click();
  await editor.main.table.row(4).locator.click();
  const keyMessage = await editor.detail.general.key.message();
  await keyMessage.expectToBeError('Database invalid-key contains invalid characters');
  await expect(keyMessage.locator.getByRole('button', { name: 'ivy.database.key-not-unique' })).toBeVisible();
});
