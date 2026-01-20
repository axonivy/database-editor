import { expect, test } from '@playwright/test';
import { DatabaseEditor, pmv } from '../pageobjects/DatabaseEditor';

test('load data', async ({ page }) => {
  const editor = await DatabaseEditor.openEngine(page, pmv);
  await expect(editor.main.table.rows).toHaveCount(2);

  await editor.main.table.row(0).locator.click();
  await editor.main.table.row(0).expectToHaveTexts('ivyTeamDatabase', 'ivyteam.io:3306', 'mySQL');

  await expect(editor.detail.general.jdbcDriver.locator).toHaveText('mySQL');
  await expect(editor.detail.general.maxConnections).toHaveValue('10');

  await expect(editor.detail.properties.host).toHaveValue('ivyteam.io');
  await expect(editor.detail.properties.userName).toHaveValue('ivy');
  await expect(editor.detail.properties.dbName).toHaveValue('ivyteam');
  await expect(editor.detail.properties.port).toHaveValue('3306');
  await expect(editor.detail.properties.password).toHaveValue('password');

  await editor.detail.additionalProperties.trigger.click();
  await expect(editor.detail.additionalProperties.table.rows).toHaveCount(2);
  await editor.detail.additionalProperties.table.row(0).expectToHaveValues('additionalPropertyName0', 'additionalPropertyValue0');
  await editor.detail.additionalProperties.table.row(1).expectToHaveValues('additionalPropertyName1', 'additionalPropertyValue1');

  await editor.main.table.row(1).locator.click();
  await editor.main.table.row(1).expectToHaveTexts('axonIvyDatabase', '', 'HSQL Db Memory');

  await expect(editor.detail.general.jdbcDriver.locator).toHaveText('HSQL Db Memory');
  await expect(editor.detail.general.maxConnections).toHaveValue('42');

  await expect(editor.detail.properties.userName).toHaveValue('admin');
  await expect(editor.detail.properties.dbName).toHaveValue('axonivy');
  await expect(editor.detail.properties.password).toHaveValue('admin');

  await editor.detail.additionalProperties.trigger.click();
  await expect(editor.detail.additionalProperties.table.rows).toHaveCount(0);
});
