import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import type { ImportDialog } from '../../../pageobjects/ImportDialog';
import type { ResultPage } from '../../../pageobjects/ResultPage';

test.describe('CreationResult page', () => {
  let editor: DatabaseEditor;
  let importDialog: ImportDialog;
  let resultPage: ResultPage;

  test.beforeEach(async ({ page }) => {
    editor = await DatabaseEditor.openMock(page);
    importDialog = editor.importDialog;
    await importDialog.open();
    await importDialog.dataSourcePage.projectSelection.choose('project1-name');
    await importDialog.dataSourcePage.databaseSelect.choose('IvySystemDatabase');
    await importDialog.next.click();
    await importDialog.tableSelectionPage.tableSelect.choose('Users-001');
    await importDialog.next.click();
    await importDialog.creationPage.table.locator.getByRole('checkbox').first().click();
    resultPage = importDialog.resultPage;
  });

  test('success', async () => {
    await importDialog.creationPage.namespace.fill('test');
    await importDialog.create.click();
    await expect(resultPage.header).toHaveText('Creation of entities was successful');
    await expect(resultPage.locator).toBeVisible();
    await expect(importDialog.back).toBeEnabled();
  });

  test('error', async () => {
    await importDialog.creationPage.namespace.fill('testError');
    await importDialog.create.click();
    const row = resultPage.table.rows.nth(1);
    const table = resultPage.table;
    await table.expectHeaders('Table', 'Entity Type', 'Error Message');
    await expect(row).toContainText('Users-001');
    await expect(row).toContainText('EntityClass');
    await expect(row).toContainText('Object already exists');
  });
});
