import { type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';
import { Select } from '../abstract/Select';

export class GeneralCollapsible extends Collapsible {
  readonly database: Select;
  readonly driver: Select;
  readonly maxConnections: Locator;

  constructor(page: Page, parent: Locator) {
    super(parent, { name: 'General' });
    this.database = new Select(page, this.content, { name: 'Database' });
    this.driver = new Select(page, this.content, { name: 'Driver' });
    this.maxConnections = this.content.getByRole('spinbutton', { name: 'Max. Connections' });
  }
}
