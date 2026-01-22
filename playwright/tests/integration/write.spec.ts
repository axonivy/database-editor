import { expect, test } from '@playwright/test';
import { DatabaseEditor } from '../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openNewEngine(page);
});

test.afterEach(async () => {
  await editor.deletePmv();
});

test('save data', async () => {
  await editor.main.locator.getByRole('button', { name: 'Add Database Connection' }).click();
  await editor.main.control.add.name.locator.fill('MyDatabase');
  await editor.main.control.add.create.click();

  await editor.detail.general.jdbcDriver.select('Microsoft SQL Server');
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

  await editor.main.table.row(0).locator.click();
  await editor.main.table.row(0).expectToHaveTexts('MyDatabase', 'myhost:1433', 'Microsoft SQL Server');

  await expect(editor.detail.general.jdbcDriver.locator).toHaveText('Microsoft SQL Server');
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
