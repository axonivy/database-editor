import { type Locator } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';
import { Table } from '../main/Table';

export class AdditionalPropertiesCollapsible extends Collapsible {
  readonly add: Locator;
  readonly delete: Locator;
  readonly table: Table;

  constructor(parent: Locator) {
    super(parent, { name: 'Additional Properties' });
    this.add = this.content.getByRole('button', { name: 'Add Property' });
    this.delete = this.content.getByRole('button', { name: 'Delete Property' });
    this.table = new Table(this.content);
  }
}
