import type { Locator, Page } from '@playwright/test';
import { AddDatabaseConnection } from './AddDatabaseConnection';
import { ImportDialog } from './import-wizard/ImportDialog';

export class Control {
  readonly locator: Locator;
  readonly add: AddDatabaseConnection;
  readonly delete: Locator;
  readonly importDialog: ImportDialog;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.database-editor-main-control');
    this.add = new AddDatabaseConnection(page, this.locator);
    this.delete = this.locator.getByRole('button', { name: 'Delete Database Connection' });
    this.importDialog = new ImportDialog(page, this.locator);
  }
}
