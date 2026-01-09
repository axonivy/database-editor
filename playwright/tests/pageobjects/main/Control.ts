import type { Locator, Page } from '@playwright/test';
import { ImportDialog } from './import-wizard/ImportDialog';

export class Control {
  readonly locator: Locator;
  readonly importDialog: ImportDialog;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.database-editor-main-control');
    this.importDialog = new ImportDialog(page, this.locator);
  }
}
