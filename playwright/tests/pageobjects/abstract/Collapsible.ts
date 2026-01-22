import { type Locator } from '@playwright/test';

export abstract class Collapsible {
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly content: Locator;

  constructor(parent: Locator, options?: { name?: string }) {
    if (options?.name) {
      this.locator = parent.locator(`.ui-collapsible:has(.ui-collapsible-trigger:has-text('${options.name}'))`);
    } else {
      this.locator = parent.locator('.ui-collapsible').first();
    }
    this.trigger = this.locator.locator('.ui-collapsible-trigger');
    this.content = this.locator.locator('.ui-collapsible-content');
  }
}
