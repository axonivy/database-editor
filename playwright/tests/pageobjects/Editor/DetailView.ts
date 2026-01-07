import type { Locator, Page } from '@playwright/test';

export class DetailView {
  readonly locator: Locator;
  readonly title: Locator;
  readonly collapsibles: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.database-detail-view');
    this.title = parent.locator('.detail-view-header');
    this.collapsibles = this.locator.locator('.ui-collapsible');
  }
}
