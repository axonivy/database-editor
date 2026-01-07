// database-detail-view

import type { Locator, Page } from '@playwright/test';

export class Collapsible {
  readonly locator: Locator;
  readonly title: Locator;
  readonly inputs: Locator;

  constructor(page: Page, parent: Locator, title: string) {
    this.locator = parent.locator('.ui-collapsible').getByText(title);
    this.title = this.locator.locator('.ui-collapsible-trigger > div');
    this.inputs = this.locator.locator('.ui-field');
  }
}
