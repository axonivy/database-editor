import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test('title', async () => {
  await expect(editor.main.toolbar.locator).toHaveText('Database Editor - project1-name');
});

test('remove selection', async () => {
  await editor.main.table.row(0).locator.click();
  await editor.main.table.row(0).expectToBeSelected();
  await editor.main.table.header(0).locator.click();
  await editor.main.table.row(0).expectNotToBeSelected();
});

test.describe('table layout', () => {
  test('table headers', async () => {
    const headerName = editor.main.table.header(0);
    const headerUrl = editor.main.table.header(1);
    const headerDriver = editor.main.table.header(2);

    await expect(headerName.locator).toHaveText('Name');
    await expect(headerUrl.locator).toHaveText('URL');
    await expect(headerDriver.locator).toHaveText('Driver');
  });

  test('table row', async () => {
    await editor.main.table.row(0).expectToHaveTexts('database0', 'host0:3306', 'MySQL');
    await editor.main.table.row(1).expectToHaveTexts('database1', '', 'MariaDB');
  });
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
    await expect(editor.detail.locator).toBeVisible();
    await editor.page.keyboard.press('Enter');
    await expect(editor.detail.locator).toBeHidden();
    await editor.page.keyboard.press('Enter');
    await expect(editor.detail.locator).toBeVisible();
  });
});

test('sortable', async () => {
  await expect(editor.main.table.header(0).sort).toHaveAttribute('data-sort-state', 'false');
  await expect(editor.main.table.row(0).cell(0).locator).toHaveText('database0');
  await editor.main.table.header(0).sort.click();
  await expect(editor.main.table.header(0).sort).toHaveAttribute('data-sort-state', 'asc');
  await expect(editor.main.table.row(0).cell(0).locator).toHaveText('database0');
  await editor.main.table.header(0).sort.click();
  await expect(editor.main.table.header(0).sort).toHaveAttribute('data-sort-state', 'desc');
  await expect(editor.main.table.row(0).cell(0).locator).toHaveText('otherDatabase');
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

    await add.name.locator.clear();
    await nameMessage.expectToBeError('Name cannot be empty.');
    await expect(add.create).toBeDisabled();

    await add.name.locator.fill('database1');
    await nameMessage.expectToBeError('Name is already taken.');
    await expect(add.create).toBeDisabled();

    await add.name.locator.fill('valid');
    await expect(nameMessage.locator).toBeHidden();
    await expect(add.create).toBeEnabled();
  });

  test('create', async () => {
    await editor.main.control.add.trigger.click();
    await editor.main.control.add.create.click();

    const row = editor.main.table.row(4);
    await expect(row.cell(0).locator).toHaveText('NewDatabaseConnection');
    await row.expectToBeSelected();
    await expect(editor.detail.toolbar).toHaveText('Connection Properties - NewDatabaseConnection');
    await expect(editor.detail.general.database.locator).toHaveText('MySQL');
    await expect(editor.detail.general.driver.locator).toHaveText('MySQL');
    await expect(editor.detail.general.maxConnections).toHaveValue('5');
  });

  test('keyboard', async () => {
    const add = editor.main.control.add;

    await editor.page.keyboard.press('a');
    await expect(add.locator).toBeVisible();

    await add.name.locator.clear();
    await editor.page.keyboard.press('Enter');
    await expect(add.locator).toBeVisible();

    await add.name.locator.fill('valid0');
    await editor.page.keyboard.press('ControlOrMeta+Enter');
    await expect(add.locator).toBeVisible();

    await add.name.locator.fill('valid1');
    await editor.page.keyboard.press('Enter');
    await expect(add.locator).toBeHidden();

    await expect(editor.main.table.row(4).cell(0).locator).toHaveText('valid0');
    await expect(editor.main.table.row(5).cell(0).locator).toHaveText('valid1');

    await add.trigger.click();
    await editor.page.keyboard.down('ControlOrMeta');
    await add.create.click();
    await editor.page.keyboard.up('ControlOrMeta');
    await expect(add.locator).toBeVisible();

    await editor.page.keyboard.press('Escape');
    await expect(add.locator).toBeHidden();
    await expect(editor.main.table.row(6).cell(0).locator).toHaveText('NewDatabaseConnection');
  });
});

test.describe('delete', () => {
  test('delete', async () => {
    const row = editor.main.table.row(0);

    await expect(editor.main.control.delete).toBeDisabled();
    await expect(row.cell(0).locator).toHaveText('database0');

    await row.locator.click();
    await expect(editor.main.control.delete).toBeEnabled();

    await editor.main.control.delete.click();
    await expect(row.cell(0).locator).toHaveText('database1');

    await row.expectToBeSelected();
    await expect(editor.detail.toolbar).toHaveText('Connection Properties - database1');
  });

  test('keyboard', async () => {
    const row = editor.main.table.row(0);

    await expect(row.cell(0).locator).toHaveText('database0');
    await row.locator.click();
    await editor.page.keyboard.press('Delete');
    await expect(row.cell(0).locator).toHaveText('database1');
  });
});
