import { type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';
import { Select } from '../abstract/Select';

export class GeneralCollapsible extends Collapsible {
  readonly jdbcDriver: Select;
  readonly maxConnections: Locator;

  constructor(page: Page, parent: Locator) {
    super(parent, { name: 'General' });
    this.jdbcDriver = new Select(page, this.content, { name: 'Jdbc Driver' });
    this.maxConnections = this.content.getByRole('spinbutton', { name: 'Max. Connections' });
  }
}
