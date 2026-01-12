import type { Locator, Page } from '@playwright/test';

export class AddDatabaseConnection {
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly cancel: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog', { name: 'Add Database Connection' });
    this.trigger = parent.getByRole('button', { name: 'Add Database Connection' });
    this.cancel = this.locator.getByRole('button', { name: 'Cancel' });
  }
}
