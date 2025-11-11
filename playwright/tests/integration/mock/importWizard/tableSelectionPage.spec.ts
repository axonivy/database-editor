import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import type { ImportDialog } from '../../../pageobjects/ImportDialog';
import type { TableSelectionPage } from '../../../pageobjects/TableSelectionPage';

test.describe('table selection page', () => {
  let editor: DatabaseEditor;
  let importDialog: ImportDialog;
  let tableSelectionPage: TableSelectionPage;

  test.beforeEach(async ({ page }) => {
    editor = await DatabaseEditor.openMock(page);
    importDialog = editor.importDialog;
    await importDialog.open();
    await importDialog.dataSourcePage.projectSelection.choose('project1-name');
    await importDialog.dataSourcePage.databaseSelect.choose('MockDatabase-001');
    await importDialog.next.click();
    tableSelectionPage = importDialog.tableSelectionPage;
  });

  test('visible', async () => {
    await expect(tableSelectionPage.locator).toBeVisible();
    await expect(tableSelectionPage.tableList).toHaveCount(2);
    await expect(importDialog.back).toBeEnabled();
    await expect(importDialog.next).toBeDisabled();
  });

  test('table selection', async () => {
    const availableTables = tableSelectionPage.tableList.nth(0);
    const tables = availableTables.locator('.selection-list-button');
    await expect(tables).toHaveCount(3);

    const selectedTables = tableSelectionPage.tableList.nth(1);
    const activeTables = selectedTables.locator('.selection-list-button');
    await expect(activeTables).toHaveCount(0);

    await tables.first().click();
    await tables.first().click();
    await tables.first().click();
    await expect(tables).toHaveCount(0);

    await expect(activeTables).toHaveCount(3);
    await activeTables.first().click();
    await expect(activeTables).toHaveCount(2);
  });

  test('proceed requirement', async () => {
    const availableTables = tableSelectionPage.tableList.nth(0);
    const tables = availableTables.locator('.selection-list-button');
    await expect(tables).toHaveCount(3);
    await tables.first().click();
    await expect(importDialog.next).toBeEnabled();
  });

  test('back button', async () => {
    await expect(importDialog.back).toBeEnabled();
    await importDialog.back.click();
    await expect(importDialog.dataSourcePage.locator).toBeVisible();
    await expect(importDialog.next).toBeEnabled();
  });
});
