import test, { expect } from '@playwright/test';
import type { CreationPage } from '../../../pageobjects/CreationPage';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import type { ImportDialog } from '../../../pageobjects/ImportDialog';

test.describe('creationPage page', () => {
  let editor: DatabaseEditor;
  let importDialog: ImportDialog;
  let creationPage: CreationPage;

  test.beforeEach(async ({ page }) => {
    editor = await DatabaseEditor.openMock(page);
    importDialog = editor.importDialog;
    await importDialog.open();
    await importDialog.dataSourcePage.projectSelection.choose('project1-name');
    await importDialog.dataSourcePage.databaseSelect.choose('IvySystemDatabase');
    await importDialog.next.click();
    await importDialog.tableSelectionPage.tableSelect.first().click();
    await importDialog.next.click();
    creationPage = importDialog.creationPage;
  });

  test('visible', async () => {
    await expect(creationPage.locator).toBeVisible();
    await expect(creationPage.table.locator).toBeVisible();
    await expect(importDialog.back).toBeEnabled();
    await expect(importDialog.next).toBeHidden();
    await expect(importDialog.create).toBeDisabled();
  });

  test('table headers', async () => {
    const table = creationPage.table;
    await table.expectHeaders('Table', 'Entity Class', 'Form Dialog', 'Process', 'Attributes');
  });

  test('table rows', async () => {
    const row = creationPage.table.rows.nth(1);
    await expect(row).toContainText('Users-001');
    const cells = row.locator('.ui-table-cell');
    await expect(cells).toHaveCount(5);
    await expect(cells.getByRole('checkbox')).toHaveCount(3);
  });

  test('creation requirements', async () => {
    await creationPage.table.locator.getByRole('checkbox').first().click();
    await creationPage.namespace.fill('testNamespace');
    await expect(importDialog.create).toBeEnabled();
  });

  test('back button', async () => {
    await expect(importDialog.back).toBeEnabled();
    await importDialog.back.click();
    await expect(importDialog.tableSelectionPage.locator).toBeVisible();
    await expect(importDialog.next).toBeEnabled();
  });

  test('attributes', async () => {
    await creationPage.attributeButton.click();
    const attributeTable = creationPage.attributeTable;
    await expect(attributeTable.locator).toBeVisible();
    await attributeTable.expectHeaders('Column', 'Type', 'Generate');
    const row = attributeTable.rows.nth(1);
    await expect(row).toContainText('id');
    await expect(row).toContainText('double');
    const cells = row.locator('.ui-table-cell');
    await expect(cells).toHaveCount(3);
    await expect(cells.getByRole('checkbox')).toHaveCount(1);
  });
});
