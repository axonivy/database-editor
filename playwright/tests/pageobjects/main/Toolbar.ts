import { type Locator, type Page } from '@playwright/test';

export class Toolbar {
  readonly page: Page;
  readonly locator: Locator;
  readonly undo: Locator;
  readonly redo: Locator;
  readonly detailButton: Locator;

  constructor(page: Page, parent: Locator) {
    this.page = page;
    this.locator = parent.locator('.database-editor-toolbar');
    this.undo = this.locator.getByRole('button', { name: 'Undo' });
    this.redo = this.locator.getByRole('button', { name: 'Redo' });
    this.detailButton = this.locator.locator('button:has(i.ivy-layout-sidebar-right-collapse)');
  }
}
