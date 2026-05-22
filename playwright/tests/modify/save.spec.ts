import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../pageobjects/DatabaseEditor';

test('save data', async ({ page }) => {
  const editor = await DatabaseEditor.openEngine(page);
  await editor.main.locator.getByRole('button', { name: 'Add Database Connection' }).click();
  await editor.main.control.add.name.locator.fill('MyDatabase');
  await editor.main.control.add.create.click();

  await editor.detail.general.database.select('Microsoft SQL Server');
  await editor.detail.general.maxConnections.fill('20');
  await editor.detail.properties.host.fill('myhost');
  await editor.detail.properties.userName.fill('myUserName');
  await editor.detail.properties.dbName.fill('mydatabase');
  await editor.detail.properties.port.fill('1433');
  await editor.detail.properties.password.fill('mypassword');

  await editor.detail.additionalProperties.trigger.click();
  await editor.detail.additionalProperties.add.click();
  await editor.detail.additionalProperties.table.row(0).inputCell(0).fill('myAdditionalProperty');
  await editor.detail.additionalProperties.table.row(0).inputCell(1).fill('myAdditionalValue');

  await editor.page.reload();

  const row = editor.main.table.lastRow();
  await row.locator.click();
  await row.expectToHaveTexts('MyDatabase', 'myhost:1433', 'Microsoft SQL Server');

  await expect(editor.detail.general.database.locator).toHaveText('Microsoft SQL Server');
  await expect(editor.detail.general.driver.locator).toHaveText('Microsoft SQL Server');
  await expect(editor.detail.general.maxConnections).toHaveValue('20');

  await expect(editor.detail.properties.host).toHaveValue('myhost');
  await expect(editor.detail.properties.userName).toHaveValue('myUserName');
  await expect(editor.detail.properties.dbName).toHaveValue('mydatabase');
  await expect(editor.detail.properties.port).toHaveValue('1433');
  await expect(editor.detail.properties.password).toHaveValue('mypassword');

  await editor.detail.additionalProperties.trigger.click();
  await expect(editor.detail.additionalProperties.table.rows).toHaveCount(1);
  await editor.detail.additionalProperties.table.row(0).expectToHaveValues('myAdditionalProperty', 'myAdditionalValue');
});

test('icon chooser client', async ({ page }) => {
  const editor = await DatabaseEditor.openEngine(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.general.icon.locator).toHaveValue('');

  await editor.detail.general.icon.select('microsoft');
  await expect(editor.detail.general.icon.locator).toHaveValue('res:/webContent/icons/microsoft.svg');
  const selectedRow = editor.main.table.row(0);
  const iconInRow = selectedRow.locator.locator('img');
  for (const img of await iconInRow.all()) {
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  }
  await editor.detail.general.icon.locator.fill('');
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.general.icon.locator).toHaveValue('');
});
