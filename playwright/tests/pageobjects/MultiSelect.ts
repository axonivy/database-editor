import { expect, type Locator, type Page } from '@playwright/test';

export class MultiSelect {
  readonly page: Page;
  readonly parent: Locator;
  readonly locator: Locator;

  constructor(page: Page, parent: Locator) {
    this.page = page;
    this.parent = parent;
    this.locator = parent.locator('.table-select-trigger');
  }

  async choose(value: string) {
    await this.locator.click();
    await this.page.getByRole('menuitemcheckbox', { name: value, exact: true }).first().click();
    await this.page.keyboard.press('Escape');
  }

  async expectToHaveOptions(...options: Array<string>) {
    await this.locator.click();
    await expect(this.page.getByRole('menuitemcheckbox')).toHaveText(options);
    await this.page.keyboard.press('Escape');
  }
}
