import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import type { DataSourcePage } from '../../../pageobjects/main/import-wizard/DataSourcePage';
import type { ImportDialog } from '../../../pageobjects/main/import-wizard/ImportDialog';

let editor: DatabaseEditor;
let importDialog: ImportDialog;
let dataSourcePage: DataSourcePage;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
  importDialog = editor.main.control.importDialog;
  await importDialog.trigger.click();
  dataSourcePage = importDialog.dataSourcePage;
});

test('project selection', async () => {
  await expect(dataSourcePage.projectSelection.locator).toHaveText('project1-name');
  await expect(dataSourcePage.databaseSelect.locator).toBeEnabled();
});

test('database selection', async () => {
  await dataSourcePage.projectSelection.choose('project1-name');
  const select = dataSourcePage.databaseSelect;
  await expect(select.locator).toBeVisible();
  await select.expectToHaveOptions('MockDatabase-001', 'MockDatabase-002', 'MockDatabase-003');
  await select.choose('MockDatabase-001');
  await expect(select.locator).toContainText('MockDatabase-001');
});

test('required projects', async () => {
  const select = dataSourcePage.databaseSelect;
  await expect(select.locator).toBeVisible();
  await select.expectToHaveOptions('MockDatabase-001', 'MockDatabase-002', 'MockDatabase-003');
  await dataSourcePage.requiredProjects.click();
  await select.expectToHaveGroups('project1-name', 'project2-name');
  await select.expectToHaveOptions('MockDatabase-001', 'MockDatabase-002', 'MockDatabase-003', 'MockDatabase-001', 'MockDatabase-002', 'MockDatabase-003');
});

test('proceed requirement', async () => {
  await expect(importDialog.next).toBeDisabled();
  await dataSourcePage.projectSelection.choose('project1-name');
  await dataSourcePage.databaseSelect.choose('MockDatabase-001');
  await expect(importDialog.next).toBeEnabled();
});
