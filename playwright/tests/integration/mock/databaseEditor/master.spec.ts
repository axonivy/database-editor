import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test('remove selection', async () => {
  await editor.main.table.row(0).locator.click();
  await editor.main.table.row(0).expectToBeSelected();
  await editor.main.table.header(0).locator.click();
  await editor.main.table.row(0).expectNotToBeSelected();
});

test.describe('table keyboard support', () => {
  test('move selection via arrowKey', async () => {
    await editor.main.table.expectToHaveNoSelection();
    await editor.main.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await editor.main.table.row(1).expectToBeSelected();
  });

  test('toggle detail via enter', async () => {
    await editor.main.table.row(0).locator.click();
    await expect(editor.detailView.locator).toBeVisible();
    await editor.page.keyboard.press('Enter');
    await expect(editor.detailView.locator).toBeHidden();
    await editor.page.keyboard.press('Enter');
    await expect(editor.detailView.locator).toBeVisible();
  });
});

test('sortable', async () => {
  await expect(editor.main.table.header(0).sort).toHaveAttribute('data-sort-state', 'false');
  await expect(editor.main.table.row(0).column(0).locator).toHaveText('TestDatabaseConnection-001');
  await editor.main.table.header(0).sort.click();
  await expect(editor.main.table.header(0).sort).toHaveAttribute('data-sort-state', 'asc');
  await expect(editor.main.table.row(0).column(0).locator).toHaveText('TestDatabaseConnection-001');
  await editor.main.table.header(0).sort.click();
  await expect(editor.main.table.header(0).sort).toHaveAttribute('data-sort-state', 'desc');
  await expect(editor.main.table.row(0).column(0).locator).toHaveText('TestDatabaseConnection-003');
});
