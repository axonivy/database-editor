import { expect, type Locator, type Page } from '@playwright/test';

export class Toolbar {
  readonly page: Page;
  readonly locator: Locator;
  readonly detailButton: Locator;

  constructor(page: Page, parent: Locator) {
    this.page = page;
    this.locator = parent.locator('.database-editor-toolbar');
    this.detailButton = this.locator.locator('button:has(i.ivy-layout-sidebar-right-collapse)');
  }

  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }
}
