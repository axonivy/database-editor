import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/Editor/DatabaseEditor';
import type { DetailView } from '../../../pageobjects/Editor/DetailView';

let editor: DatabaseEditor;
let detailView: DetailView;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
  await editor.toolbar.detailButton.click();
  await editor.locator.locator('.selection-list-button-text').first().click();
  detailView = editor.detailView;
});

test('detail view - configuration elements', async () => {
  await expect(detailView.locator).toBeVisible();
  await expect(detailView.title).toHaveText('Connection Properties');
  const tabs = await detailView.tabs.all();
  expect(tabs).toHaveLength(1);
  await expect(detailView.tabs.getByText('Configuration')).toBeVisible();
  const collapisbles = await detailView.collapsibles.all();
  expect(collapisbles).toHaveLength(2);
});

test('detail view - inputs', async () => {
  const general = detailView.collapsibles.getByText('General');
  const properties = detailView.collapsibles.getByText('Properties');

  await expect(general).toBeVisible();
  await expect(properties).toBeVisible();

  const generalInputs = detailView.collapsibles.nth(0).locator('.ui-field');
  const propertiesInputs = detailView.collapsibles.nth(1).locator('.ui-field');

  let inputs = await generalInputs.all();
  expect(inputs).toHaveLength(2);
  await expect(generalInputs.getByText('Jdbc Driver')).toBeVisible();
  await expect(generalInputs.getByText('Max. Connections')).toBeVisible();

  inputs = await propertiesInputs.all();
  expect(inputs).toHaveLength(5);
  await expect(propertiesInputs.getByText('User')).toBeVisible();
  await expect(propertiesInputs.getByText('Database name')).toBeVisible();
  await expect(propertiesInputs.getByText('Port')).toBeVisible();
  await expect(propertiesInputs.getByText('Host')).toBeVisible();
  await expect(propertiesInputs.getByText('Password')).toBeVisible();
});

test('detail view - switch driver', async () => {
  const driver = detailView.locator.getByRole('combobox');
  await expect(driver).toHaveText('com.mysql.cj.jdbc.Driver');
  await driver.click();
  await editor.locator.getByText('sun.jdbc.odbc.JdbcOdbcDriver').click();
  await expect(driver).toHaveText('sun.jdbc.odbc.JdbcOdbcDriver');
  const properties = await detailView.collapsibles.nth(1).locator('.ui-field').all();
  expect(properties).toHaveLength(3);
});
