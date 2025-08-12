import { expect, type Locator, type Page } from '@playwright/test';

export class Toolbar {
  readonly page: Page;
  readonly locator: Locator;

  constructor(page: Page, parent: Locator) {
    this.page = page;
    this.locator = parent.locator('.database-editor-main-toolbar');
  }

  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }
}
