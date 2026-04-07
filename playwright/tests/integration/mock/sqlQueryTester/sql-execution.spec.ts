import { expect, test } from '@playwright/test';
import { DatabaseEditor, pmv } from '../../../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openEngine(page, pmv);
  await editor.main.table.row(1).locator.click();
});

test('execute sql shows result table', async () => {
  const { sqlQueryTester } = editor.main.control;
  try {
    await sqlQueryTester.open();

    await sqlQueryTester.textarea.fill('create table test (id int, name varchar(255))');
    await sqlQueryTester.executeButton.click();

    await sqlQueryTester.textarea.fill("insert into test values (1, 'Name 1')");
    await sqlQueryTester.executeButton.click();

    await sqlQueryTester.tableCombobox.click();
    await editor.page.getByRole('option', { name: 'test' }).click();

    await expect(sqlQueryTester.resultTable()).toBeVisible();
    await expect(sqlQueryTester.resultHeader(0)).toHaveText('ID');
    await expect(sqlQueryTester.resultHeader(1)).toHaveText('NAME');
    await expect(sqlQueryTester.resultCell(0, 0)).toHaveText('1');
    await expect(sqlQueryTester.resultCell(0, 1)).toHaveText('Name 1');
  } finally {
    await sqlQueryTester.executeIfDialogVisible('DROP TABLE test');
  }
});

test('LastQuery is loaded into textarea', async () => {
  const { sqlQueryTester } = editor.main.control;
  await sqlQueryTester.open();
  await expect(sqlQueryTester.textarea).toHaveValue('DROP TABLE test');
});
