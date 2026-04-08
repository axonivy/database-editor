import { expect, test } from '@playwright/test';
import { DatabaseEditor, pmv } from '../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openEngine(page, pmv);
  await editor.main.table.row(1).locator.click();
});

test('execute sql shows result table', async () => {
  const dialog = await editor.main.openSqlQueryTesterDialog();

  try {
    await dialog.textarea.fill('create table test (id int, name varchar(255))');
    await dialog.executeButton.click();

    await dialog.textarea.fill("insert into test values (1, 'Name 1')");
    await dialog.executeButton.click();

    await dialog.tableCombobox.click();
    await editor.page.getByRole('option', { name: 'test' }).click();

    await expect(dialog.resultTable()).toBeVisible();
    await expect(dialog.resultHeader(0)).toHaveText('ID');
    await expect(dialog.resultHeader(1)).toHaveText('NAME');
    await expect(dialog.resultCell(0, 0)).toHaveText('1');
    await expect(dialog.resultCell(0, 1)).toHaveText('Name 1');
  } finally {
    await dialog.executeIfDialogVisible('DROP TABLE test');
  }
});

test('LastQuery is loaded into textarea', async () => {
  const dialog = await editor.main.openSqlQueryTesterDialog();
  await expect(dialog.textarea).toHaveValue('DROP TABLE test');
});
