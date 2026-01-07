import type { Locator, Page } from '@playwright/test';

export class DetailView {
  readonly locator: Locator;
  readonly title: Locator;
  readonly tabs: Locator;
  readonly collapsibles: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.database-detail-view');
    this.title = parent.locator('.detail-view-header');
    this.tabs = this.locator.getByRole('tab');
    this.collapsibles = this.locator.locator('.ui-collapsible');
  }
}
