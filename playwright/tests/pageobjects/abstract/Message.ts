import { expect, type Locator } from '@playwright/test';

export class Message {
  readonly locator: Locator;

  constructor(parent: Locator, options?: { id?: string; className?: string }) {
    if (options?.id) {
      this.locator = parent.locator(`[id="${options.id}"]`);
    } else {
      this.locator = parent.locator('.ui-message').first();
    }
  }

  async expectToBeError(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'error');
  }
}
