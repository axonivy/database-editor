import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import { consoleLog } from '../../../pageobjects/console-log';

let editor: DatabaseEditor;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
});

test.describe('additional properties', () => {
  test('row data', async () => {
    await editor.main.table.row(0).locator.click();
    await expect(editor.detail.additionalProperties.content).toBeHidden();
    await editor.detail.additionalProperties.trigger.click();
    await expect(editor.detail.additionalProperties.content).toBeVisible();
    await expect(editor.detail.additionalProperties.table.rows).toHaveCount(4);
    await editor.detail.additionalProperties.table.row(0).expectToHaveValues('prop0', 'value0');
    await editor.detail.additionalProperties.table.row(1).expectToHaveValues('prop1', 'value1');
    await editor.detail.additionalProperties.table.row(2).expectToHaveValues('prop2', 'value2');
    await editor.detail.additionalProperties.table.row(3).expectToHaveValues('prop3', 'value3');
  });

  test('add', async () => {
    await editor.main.table.row(0).locator.click();
    await editor.detail.additionalProperties.trigger.click();
    await expect(editor.detail.additionalProperties.table.rows).toHaveCount(4);

    await editor.detail.additionalProperties.add.click();
    await expect(editor.detail.additionalProperties.table.rows).toHaveCount(5);
    await editor.detail.additionalProperties.table.row(4).expectToHaveValues('Enter a Key', 'Enter a Value');
  });

  test('delete', async () => {
    await editor.main.table.row(0).locator.click();
    await editor.detail.additionalProperties.trigger.click();
    await expect(editor.detail.additionalProperties.table.rows).toHaveCount(4);

    await expect(editor.detail.additionalProperties.delete).toBeDisabled();
    await editor.detail.additionalProperties.table.row(3).locator.click();
    await expect(editor.detail.additionalProperties.delete).toBeEnabled();

    await editor.detail.additionalProperties.delete.click();
    await expect(editor.detail.additionalProperties.table.rows).toHaveCount(3);
    await editor.detail.additionalProperties.table.row(2).expectToBeSelected();
    await editor.detail.additionalProperties.table.row(2).expectToHaveValues('prop2', 'value2');
  });
});

test('switch driver', async () => {
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.general.database.locator).toHaveText('MySQL');
  await editor.detail.general.database.expectToHaveOptions('Hypersonic SQL Db', 'MariaDB', 'Microsoft SQL Server', 'MySQL');
  await expect(editor.detail.general.driver.locator).toHaveText('MySQL');
  await editor.detail.general.driver.expectToHaveOptions('MySQL');

  await expect(editor.detail.properties.userName).toBeVisible();
  await expect(editor.detail.properties.dbName).toBeVisible();
  await expect(editor.detail.properties.port).toBeVisible();
  await expect(editor.detail.properties.host).toBeVisible();
  await expect(editor.detail.properties.password).toBeVisible();

  await editor.detail.general.database.select('Hypersonic SQL Db');
  await expect(editor.detail.general.driver.locator).toHaveText('HSQL Db File');
  await editor.detail.general.driver.expectToHaveOptions('HSQL Db File', 'HSQL Db Memory', 'HSQL Db Remote Server');

  await editor.detail.general.driver.select('HSQL Db Memory');
  await expect(editor.detail.properties.userName).toBeVisible();
  await expect(editor.detail.properties.dbName).toBeVisible();
  await expect(editor.detail.properties.port).toBeHidden();
  await expect(editor.detail.properties.host).toBeHidden();
  await expect(editor.detail.properties.password).toBeVisible();
});

test('title', async () => {
  await expect(editor.detail.toolbar).toHaveText('Connection Properties');
  await editor.main.table.row(1).locator.click();
  await expect(editor.detail.toolbar).toHaveText('Connection Properties - database1');
});

test('empty', async () => {
  await expect(editor.detail.panelMessage).toHaveText('Select a Database Connection to edit its properties.');
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.panelMessage).toBeHidden();
});

test('do not leak values into details of another connection', async () => {
  await editor.main.table.row(1).locator.click();
  await editor.detail.general.database.select('MySQL');
  await editor.main.table.row(0).locator.click();
  await editor.main.table.row(1).locator.click();
  await expect(editor.detail.properties.host).toBeEmpty();
  await expect(editor.detail.properties.password).toBeEmpty();
});

test.describe('help', () => {
  test('button', async ({ page }) => {
    const helpButton = editor.detail.toolbar.getByLabel('Open Help (F1)');
    await expect(helpButton).toBeVisible();
    await helpButton.hover();
    const tooltip = page.locator('.ui-tooltip-content').getByText('Open Help (F1)');
    await expect(tooltip).toBeVisible();
    const message = consoleLog(page);
    await helpButton.click();
    expect(await message).toContain('openUrl');
  });

  test('shortuct', async ({ page }) => {
    const message = consoleLog(page);
    await page.keyboard.press('F1');
    expect(await message).toContain('openUrl');
  });
});

test.describe('driver query', () => {
  test('isPending', async () => {
    editor = await DatabaseEditor.openMock(editor.page, { metaJdbcDriversState: 'isPending' });
    await editor.main.table.row(0).locator.click();
    await expect(editor.detail.locator.locator('.database-editor-detail-spinner')).toBeVisible();
  });

  test('isError', async () => {
    editor = await DatabaseEditor.openMock(editor.page, { metaJdbcDriversState: 'isError' });
    await editor.main.table.row(0).locator.click();
    await expect(editor.detail.panelMessage).toHaveText('An error occurred: error message');
  });
});
