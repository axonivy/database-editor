import { expect, type Locator } from '@playwright/test';

export class Timeline {
  readonly locator: Locator;
  readonly items: Locator;

  constructor(parent: Locator) {
    this.locator = parent
      .getByRole('list')
      .filter({ has: parent.getByRole('button', { name: 'Data Source' }) })
      .first();
    this.items = this.locator.getByRole('button');
  }

  expectItemsCount = async (n: number) => {
    await expect(this.items).toHaveCount(n);
  };

  expectItem = async (name: string) => {
    const item = this.items.filter({ hasText: name }).first();
    await expect(item).toHaveText(name);
  };

  expectItemToBeActive = async (name: string) => {
    const item = this.items.filter({ hasText: name }).first();
    await expect(item).toHaveAttribute('aria-current', 'step');
  };
}
