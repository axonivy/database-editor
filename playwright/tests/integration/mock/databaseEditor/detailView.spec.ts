import test, { expect } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';

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
  await expect(editor.detail.general.jdbcDriver.locator).toHaveText('mySQL');
  await expect(editor.detail.properties.userName).toBeVisible();
  await expect(editor.detail.properties.dbName).toBeVisible();
  await expect(editor.detail.properties.port).toBeVisible();
  await expect(editor.detail.properties.host).toBeVisible();
  await expect(editor.detail.properties.password).toBeVisible();

  await editor.detail.general.jdbcDriver.select('MariaDB');
  await expect(editor.detail.properties.userName).toBeVisible();
  await expect(editor.detail.properties.dbName).toBeVisible();
  await expect(editor.detail.properties.port).toBeVisible();
  await expect(editor.detail.properties.host).toBeHidden();
  await expect(editor.detail.properties.password).toBeHidden();
});

test('title', async () => {
  await expect(editor.detail.toolbar).toHaveText('Connection Properties');
  await editor.main.table.row(1).locator.click();
  await expect(editor.detail.toolbar).toHaveText('Connection Properties - database1');
});

test('empty', async () => {
  const panelMessage = editor.detail.locator.locator('.ui-panel-message');
  await expect(panelMessage).toHaveText('Select a Database Connection to edit its properties.');
  await editor.main.table.row(0).locator.click();
  await expect(panelMessage).toBeHidden();
});

test('do not leak values into details of another connection', async () => {
  await editor.main.table.row(1).locator.click();
  await editor.detail.general.jdbcDriver.select('mySQL');
  await editor.main.table.row(0).locator.click();
  await editor.main.table.row(1).locator.click();
  await expect(editor.detail.properties.host).toBeEmpty();
  await expect(editor.detail.properties.password).toBeEmpty();
});
