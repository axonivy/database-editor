import test, { expect } from '@playwright/test';
import type { DataSourcePage } from '../../../pageobjects/DataSourcePage';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import type { ImportDialog } from '../../../pageobjects/ImportDialog';

test.describe('data source page', () => {
  let editor: DatabaseEditor;
  let importDialog: ImportDialog;
  let dataSourcePage: DataSourcePage;

  test.beforeEach(async ({ page }) => {
    editor = await DatabaseEditor.openMock(page);
    importDialog = editor.importDialog;
    await importDialog.open();
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

  test('proceed requirement', async () => {
    await expect(importDialog.next).toBeDisabled();
    await dataSourcePage.projectSelection.choose('project1-name');
    await dataSourcePage.databaseSelect.choose('MockDatabase-001');
    await expect(importDialog.next).toBeEnabled();
  });
});
