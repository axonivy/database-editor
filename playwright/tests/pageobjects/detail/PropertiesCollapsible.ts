import { type Locator } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';

export class PropertiesCollapsible extends Collapsible {
  readonly host: Locator;
  readonly userName: Locator;
  readonly dbName: Locator;
  readonly port: Locator;
  readonly password: Locator;

  constructor(parent: Locator) {
    super(parent, { name: 'Properties' });
    this.host = this.content.getByRole('textbox', { name: 'Host' });
    this.userName = this.content.getByRole('textbox', { name: 'User' });
    this.dbName = this.content.getByRole('textbox', { name: 'Database Name' });
    this.port = this.content.getByRole('spinbutton', { name: 'Port' });
    this.password = this.content.getByRole('textbox', { name: 'Password' });
  }
}
