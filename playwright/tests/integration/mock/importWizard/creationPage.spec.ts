import test, { expect } from '@playwright/test';
import type { CreationPage } from '../../../pageobjects/CreationPage';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import type { ImportDialog } from '../../../pageobjects/ImportDialog';

let editor: DatabaseEditor;
let importDialog: ImportDialog;

let creationPage: CreationPage;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
  importDialog = editor.importDialog;
  await importDialog.open();
  await importDialog.dataSourcePage.databaseSelect.choose('IvySystemDatabase');
  await importDialog.next.click();
  await importDialog.tableSelectionPage.tableSelect.choose('Users-001');
  await importDialog.next.click();
  creationPage = importDialog.creationPage;
});

test.describe('creationPage page', () => {
  test('visible', async () => {
    await expect(creationPage.locator).toBeVisible();
    await expect(creationPage.table.locator).toBeVisible();
    await importDialog.back.expectEnabled();
    await expect(importDialog.next.locator).toBeHidden();
    await importDialog.create.expectDisabled();
  });

  test('table headers', async () => {
    const table = creationPage.table;
    await table.expectHeaders('Table', 'Enum', 'Entity Class', 'DAO/Repo Classes');
  });

  test('table rows', async () => {
    const row = creationPage.table.rows.nth(1);
    await expect(row).toContainText('Users-001');
    const cells = row.locator('.ui-table-cell');
    await expect(cells).toHaveCount(4);
    await expect(cells.getByRole('checkbox')).toHaveCount(3);
  });

  test('creation requirements', async () => {
    await creationPage.table.locator.getByRole('checkbox').first().click();
    await importDialog.create.expectEnabled();
  });

  test('back button', async () => {
    await importDialog.back.expectEnabled();
    await importDialog.back.click();
    await expect(importDialog.tableSelectionPage.locator).toBeVisible();
    await importDialog.next.expectEnabled();
  });
});
