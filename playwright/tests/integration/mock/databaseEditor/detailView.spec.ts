import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test('configuration elements', async () => {
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.locator).toBeVisible();
});

test('inputs', async () => {
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.collapsibles).toHaveCount(3);

  const generalInputs = editor.detail.collapsibles.nth(0).locator('.ui-field');
  const propertiesInputs = editor.detail.collapsibles.nth(1).locator('.ui-field');
  const additionalInputs = editor.detail.collapsibles.nth(2).locator('.ui-table-row');

  await expect(generalInputs).toHaveCount(2);
  await expect(generalInputs.getByText('Jdbc Driver')).toBeVisible();
  await expect(generalInputs.getByText('Max. Connections')).toBeVisible();

  await expect(propertiesInputs).toHaveCount(5);
  await expect(propertiesInputs.getByText('User')).toBeVisible();
  await expect(propertiesInputs.getByText('Database name')).toBeVisible();
  await expect(propertiesInputs.getByText('Port')).toBeVisible();
  await expect(propertiesInputs.getByText('Host')).toBeVisible();
  await expect(propertiesInputs.getByText('Password')).toBeVisible();

  await expect(additionalInputs).toHaveCount(0);
  await editor.detail.collapsibles.nth(2).click();
  await expect(additionalInputs).toHaveCount(5);
});

test('switch driver', async () => {
  await editor.main.table.row(0).locator.click();
  const driver = editor.detail.locator.getByRole('combobox');
  await expect(driver).toHaveText('com.mysql.cj.jdbc.Driver');
  await driver.click();
  await editor.locator.getByText('org.mariadb.jdbc.Driver').click();
  await expect(driver).toHaveText('org.mariadb.jdbc.Driver');
  await expect(editor.detail.collapsibles.nth(1).locator('.ui-field')).toHaveCount(3);
});

test('title', async () => {
  await expect(editor.detail.title).toHaveText('Connection Properties');
  await editor.main.table.row(1).locator.click();
  await expect(editor.detail.title).toHaveText('Connection Properties - TestDatabaseConnection-002');
});

test('empty', async () => {
  const panelMessage = editor.detail.locator.locator('.ui-panel-message');
  await expect(panelMessage).toHaveText('Select a Database Connection to edit its properties.');
  await editor.main.table.row(0).locator.click();
  await expect(panelMessage).toBeHidden();
});
