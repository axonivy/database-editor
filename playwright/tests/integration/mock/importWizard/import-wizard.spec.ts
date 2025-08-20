import { expect, test } from '@playwright/test';
import { DatabaseEditor } from '../../../pageobjects/DatabaseEditor';
import type { ImportDialog } from '../../../pageobjects/ImportDialog';

let editor: DatabaseEditor;
let importDialog: ImportDialog;

test.beforeEach(async ({ page }) => {
  editor = await DatabaseEditor.openMock(page);
  importDialog = editor.importDialog;
});

test.describe('import wizard', () => {
  test('opening behaviour', async () => {
    await importDialog.trigger.expectName('Import Wizard');
    await importDialog.open();
    await expect(importDialog.locator.first()).toBeVisible();
  });

  test('navigation buttons', async () => {
    await importDialog.open();
    await importDialog.next.expectName('Go to next step');
    await importDialog.next.expectDisabled();
    await importDialog.back.expectName('Back');
    await importDialog.back.expectDisabled();
  });

  test('timeline', async () => {
    await importDialog.open();
    const timeline = importDialog.timeline;
    await timeline.expectItemsCount(3);
    await timeline.expectItem('Data Source');
    await timeline.expectItem('Select Table & Define References');
    await timeline.expectItem('Create Options');
    await timeline.expectItemToBeActive('Data Source');
  });
});
