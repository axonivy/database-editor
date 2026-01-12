import type { Locator, Page } from '@playwright/test';
import { Textbox } from '../abstract/Textbox';

export class AddDatabaseConnection {
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly name: Textbox;
  readonly cancel: Locator;
  readonly create: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog', { name: 'Add Database Connection' });
    this.trigger = parent.getByRole('button', { name: 'Add Database Connection' });
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.cancel = this.locator.getByRole('button', { name: 'Cancel' });
    this.create = this.locator.getByRole('button', { name: 'Create Database Connection' });
  }
}
