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
    await importDialog.dataSourcePage.databaseSelect.choose('IvySystemDatabase');
    await importDialog.next.click();
    tableSelectionPage = importDialog.tableSelectionPage;
  });

  test('visible', async () => {
    await expect(tableSelectionPage.locator).toBeVisible();
    await expect(tableSelectionPage.tableSelect.first()).toBeVisible();
    await expect(importDialog.back).toBeEnabled();
    await expect(importDialog.next).toBeDisabled();
  });

  test('select multiple tables', async () => {
    const select = tableSelectionPage.tableSelect;
    await select.nth(0).click();
    await select.nth(1).click();
    await select.nth(2).click();
    const selection = await tableSelectionPage.locator.locator('.active').all();
    expect(selection).toHaveLength(3);
  });

  test('proceed requirement', async () => {
    const select = tableSelectionPage.tableSelect;
    await expect(importDialog.next).toBeDisabled();
    await select.first().click();
    await expect(importDialog.next).toBeEnabled();
  });

  test('back button', async () => {
    await expect(importDialog.back).toBeEnabled();
    await importDialog.back.click();
    await expect(importDialog.dataSourcePage.locator).toBeVisible();
    await expect(importDialog.next).toBeEnabled();
  });
});
