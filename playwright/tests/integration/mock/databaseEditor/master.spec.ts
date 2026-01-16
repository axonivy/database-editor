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

test.describe('add', () => {
  test('default values', async () => {
    await editor.main.control.add.trigger.click();
    await expect(editor.main.control.add.name.locator).toHaveValue('NewDatabaseConnection');
  });

  test('validation', async () => {
    const add = editor.main.control.add;
    await add.trigger.click();
    const nameMessage = await add.name.message();

    await expect(nameMessage.locator).toBeHidden();
    await expect(add.create).toBeEnabled();

    await add.name.locator.fill('');
    await nameMessage.expectToBeError('Name cannot be empty.');
    await expect(add.create).toBeDisabled();

    await add.name.locator.fill('TestDatabaseConnection-002');
    await nameMessage.expectToBeError('Name is already taken.');
    await expect(add.create).toBeDisabled();

    await add.name.locator.fill('valid');
    await expect(nameMessage.locator).toBeHidden();
    await expect(add.create).toBeEnabled();
  });

  test('create', async () => {
    await editor.main.control.add.trigger.click();
    await editor.main.control.add.create.click();

    const row = editor.main.table.row(3);
    await expect(row.column(0).locator).toHaveText('NewDatabaseConnection');
    await row.expectToBeSelected();
    await expect(editor.detailView.title).toHaveText('Connection Properties - NewDatabaseConnection');
  });
});

test('delete', async () => {
  const row = editor.main.table.row(0);

  await expect(editor.main.control.delete).toBeDisabled();
  await expect(row.column(0).locator).toHaveText('TestDatabaseConnection-001');

  await row.locator.click();
  await expect(editor.main.control.delete).toBeEnabled();

  await editor.main.control.delete.click();
  await expect(row.column(0).locator).toHaveText('TestDatabaseConnection-002');

  await row.expectToBeSelected();
  await expect(editor.detailView.title).toHaveText('Connection Properties - TestDatabaseConnection-002');
});
