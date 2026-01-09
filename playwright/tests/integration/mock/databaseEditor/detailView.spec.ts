import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import type { DetailView } from '../../../pageobjects/detail/DetailView';

let editor: DatabaseEditor;
let detailView: DetailView;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
  await editor.main.toolbar.detailButton.click();
  await editor.locator.locator('.selection-list-button-text').first().click();
  detailView = editor.detailView;
});

test.describe('detail view', () => {
  test('configuration elements', async () => {
    await expect(detailView.locator).toBeVisible();
    await expect(detailView.title).toHaveText('Connection Properties');
    await expect(detailView.collapsibles).toHaveCount(2);
  });

  test('inputs', async () => {
    const general = detailView.collapsibles.getByText('General');
    const properties = detailView.collapsibles.getByText('Properties');

    await expect(general).toBeVisible();
    await expect(properties).toBeVisible();

    const generalInputs = detailView.collapsibles.nth(0).locator('.ui-field');
    const propertiesInputs = detailView.collapsibles.nth(1).locator('.ui-field');

    await expect(generalInputs).toHaveCount(2);
    await expect(generalInputs.getByText('Jdbc Driver')).toBeVisible();
    await expect(generalInputs.getByText('Max. Connections')).toBeVisible();

    await expect(propertiesInputs).toHaveCount(5);
    await expect(propertiesInputs.getByText('User')).toBeVisible();
    await expect(propertiesInputs.getByText('Database name')).toBeVisible();
    await expect(propertiesInputs.getByText('Port')).toBeVisible();
    await expect(propertiesInputs.getByText('Host')).toBeVisible();
    await expect(propertiesInputs.getByText('Password')).toBeVisible();
  });

  test('switch driver', async () => {
    const driver = detailView.locator.getByRole('combobox');
    await expect(driver).toHaveText('com.mysql.cj.jdbc.Driver');
    await driver.click();
    await editor.locator.getByText('sun.jdbc.odbc.JdbcOdbcDriver').click();
    await expect(driver).toHaveText('sun.jdbc.odbc.JdbcOdbcDriver');
    await expect(detailView.collapsibles.nth(1).locator('.ui-field')).toHaveCount(3);
  });
});
