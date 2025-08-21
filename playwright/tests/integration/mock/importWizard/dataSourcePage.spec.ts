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

  test('type toggle', async () => {
    const typeSelection = dataSourcePage.typeSelection;
    await expect(typeSelection).toBeVisible();
    const options = await typeSelection.getByRole('radio').allInnerTexts();
    expect(options).toContain('Database');
    expect(options).toContain('CSV/Excel');
  });

  test('database selection', async () => {
    const select = dataSourcePage.databaseSelect;
    await expect(select.locator).toBeVisible();
    await select.expectToHaveOptions('IvySystemDatabase', 'MockDatabase-001', 'MockDatabase-002', 'MockDatabase-003');
    await select.choose('IvySystemDatabase');
    await expect(select.locator).toContainText('IvySystemDatabase');
  });

  test('proceed requirement', async () => {
    await expect(importDialog.next).toBeDisabled();
    await dataSourcePage.databaseSelect.choose('IvySystemDatabase');
    await expect(importDialog.next).toBeEnabled();
  });
});
