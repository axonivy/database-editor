import { type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';
import { Select } from '../abstract/Select';
import { Textbox } from '../abstract/Textbox';

export class GeneralCollapsible extends Collapsible {
  readonly key: Textbox;
  readonly name: Locator;
  readonly icon: Select;
  readonly database: Select;
  readonly driver: Select;
  readonly maxConnections: Locator;

  constructor(page: Page, parent: Locator) {
    super(parent, { name: 'General' });
    this.key = new Textbox(this.locator, { name: 'Key' });
    this.name = this.content.getByLabel('Name');
    this.icon = new Select(page, this.locator, { name: 'Icon' });
    this.database = new Select(page, this.content, { name: 'Database' });
    this.driver = new Select(page, this.content, { name: 'Driver' });
    this.maxConnections = this.content.getByRole('spinbutton', { name: 'Max. Connections' });
  }
}
