import type { Locator, Page } from '@playwright/test';

export class Select {
  readonly page: Page;
  readonly locator: Locator;
  readonly options: Locator;

  constructor(page: Page, parent: Locator, options?: { name?: string }) {
    this.page = page;
    if (options?.name) {
      this.locator = parent.getByRole('combobox', { name: options.name, exact: true });
    } else {
      this.locator = parent.getByRole('combobox').first();
    }
    this.options = this.page.getByRole('option');
  }

  async select(option: string) {
    await this.locator.click();
    await this.options.getByText(option, { exact: true }).click();
  }
}
