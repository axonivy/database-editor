import { expect, test } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import type { ImportDialog } from '../../../pageobjects/ImportDialog';

test.describe('import wizard', () => {
  let editor: DatabaseEditor;
  let importDialog: ImportDialog;

  test.beforeEach(async ({ page }) => {
    editor = await DatabaseEditor.openMock(page);
    importDialog = editor.importDialog;
  });

  test('opening behaviour', async () => {
    await expect(importDialog.trigger).toHaveText('Generate');
    await importDialog.open();
    await expect(importDialog.locator.first()).toBeVisible();
  });

  test('navigation buttons', async () => {
    await importDialog.open();
    await expect(importDialog.next).toHaveText('Go to next step');
    await expect(importDialog.next).toBeDisabled();
    await expect(importDialog.back).toHaveText('Back');
    await expect(importDialog.back).toBeDisabled();
  });

  test('timeline', async () => {
    await importDialog.open();
    const timeline = importDialog.timeline;
    await timeline.expectItemsCount(4);
    await timeline.expectItem('Data Source');
    await timeline.expectItem('Tables');
    await timeline.expectItem('Options');
    await timeline.expectItem('Result');
    await timeline.expectItemToBeActive('Data Source');
  });
});
