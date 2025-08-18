import { expect, type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { Toolbar } from './Toolbar';

export class DatabaseEditor {
  readonly page: Page;
  readonly locator: Locator;
  readonly toolbar: Toolbar;
  readonly importButton: Button;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator(':root');
    this.toolbar = new Toolbar(page, this.locator);
    this.importButton = new Button(this.locator, { name: 'Import Wizard' });
  }

  static async openMock(page: Page, options?: { virtualize?: boolean; lng?: string }) {
    let url = 'mock.html';
    if (options) {
      url += '?';
      url += this.params(options);
    }
    return this.openUrl(page, url);
  }

  private static params(options: Record<string, string | boolean>) {
    let params = '';
    params += Object.entries(options)
      .map(([key, value]) => `&${key}=${value}`)
      .join('');
    return params;
  }

  private static async openUrl(page: Page, url: string) {
    const editor = new DatabaseEditor(page);
    await page.goto(url);
    return editor;
  }

  async takeScreenshot(fileName: string) {
    await this.hideQuery();
    const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots/target';
    const buffer = await this.page.screenshot({ path: `${dir}/screenshots/${fileName}`, animations: 'disabled' });
    expect(buffer.byteLength).toBeGreaterThan(3000);
  }

  async hideQuery() {
    await this.page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
  }
}
