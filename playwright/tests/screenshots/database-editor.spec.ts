import { expect, test } from '@playwright/test';
import { DatabaseEditor } from '../pageobjects/DatabaseEditor';
import { screenshot, screenshotElement } from './screenshot-util';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test('screenshot', async ({ page }) => {
  await editor.main.table.row(0).locator.click();
  await screenshot(page, 'database-editor');
});

test('generate wizard screenshots', async ({ page }) => {
  await editor.main.locator.getByRole('button', { name: /Generate Data Classes, Forms and Processes/i }).click();

  const wizard = page.getByRole('dialog');
  await expect(wizard).toBeVisible();
  const database = wizard.getByRole('combobox', { name: /Database/i });
  await expect(database).toBeVisible();
  await database.click();
  const mockDatabase = page.getByRole('option', { name: 'MockDatabase-001' });
  await expect(mockDatabase).toBeVisible();
  await mockDatabase.click();
  await expect(database).toContainText('MockDatabase-001');
  await screenshotElement(wizard, 'editor-database-generate-wizard');

  await wizard.getByRole('button', { name: /Next/i }).click();
  const tableSelection = wizard.getByRole('region', { name: /Tables/i });
  await expect(tableSelection).toBeVisible();
  await expect(tableSelection.getByRole('textbox')).toBeVisible();
  await screenshotElement(wizard, 'editor-database-generate-wizard-tables');

  const availableTables = tableSelection.getByRole('list', { name: /Choose the tables/i });
  await availableTables.getByRole('button', { name: 'Users-001' }).click();
  const selectedTables = tableSelection.getByRole('list', { name: /Your selection/i });
  await expect(selectedTables.getByRole('button', { name: 'Users-001' })).toBeVisible();
  await screenshotElement(wizard, 'editor-database-generate-wizard-tables-selected');

  await wizard.getByRole('button', { name: /Next/i }).click();
  const options = wizard.getByRole('region', { name: /Options/i });
  await expect(options).toBeVisible();
  const tableRow = options.getByRole('row', { name: /Users-001/ });
  const creationTypeCheckboxes = tableRow.getByRole('checkbox');
  await expect(creationTypeCheckboxes).toHaveCount(3);
  for (let index = 0; index < 3; index++) {
    await creationTypeCheckboxes.nth(index).click();
    await expect(creationTypeCheckboxes.nth(index)).toBeChecked();
  }

  await tableRow.getByRole('button', { name: /Attributes/i }).click();
  await expect(page.getByRole('columnheader', { name: /Column/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'id', exact: true })).toBeVisible();
  await screenshot(page, 'editor-database-generate-wizard-options-attributes');
});
