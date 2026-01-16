import { expect, type Locator } from '@playwright/test';

export class Timeline {
  readonly locator: Locator;
  readonly items: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('.timeline');
    this.items = this.locator.locator('.timeline-item');
  }

  expectItemsCount = async (n: number) => {
    const allItems = await this.items.all();
    expect(allItems).toHaveLength(n);
  };

  expectItem = async (name: string) => {
    const item = this.items.filter({ hasText: name }).first();
    await expect(item).toHaveText(name);
  };

  expectItemToBeActive = async (name: string) => {
    const item = this.items.filter({ hasText: name }).first();
    await expect(item).toHaveClass(/active/);
  };
}
