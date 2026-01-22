import { expect, type Locator } from '@playwright/test';

export class Table {
  readonly locator: Locator;
  readonly headers: Locator;
  readonly rows: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('table');
    this.headers = this.locator.locator('th');
    this.rows = this.locator.locator('tbody').getByRole('row');
  }

  header(index: number) {
    return new Header(this.headers, index);
  }

  row(index: number) {
    return new Row(this.rows, index);
  }

  async expectToHaveNoSelection() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      await this.row(i).expectNotToBeSelected();
    }
  }
}

export class Header {
  readonly locator: Locator;
  readonly sort: Locator;

  constructor(headers: Locator, index: number) {
    this.locator = headers.nth(index);
    this.sort = this.locator.getByRole('button');
  }
}

export class Row {
  readonly locator: Locator;

  constructor(rows: Locator, index: number) {
    this.locator = rows.nth(index);
  }

  cell(column: number) {
    return new Cell(this.locator, column);
  }

  inputCell(column: number) {
    return new InputCell(this.locator, column);
  }

  async expectToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'selected');
  }

  async expectNotToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'unselected');
  }

  async expectToHaveTexts(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      await expect(this.cell(i).locator).toHaveText(values[i]!);
    }
  }

  async expectToHaveValues(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      await expect(this.inputCell(i).locator).toHaveValue(values[i]!);
    }
  }
}

export class Cell {
  readonly locator: Locator;

  constructor(rowLocator: Locator, index: number) {
    this.locator = rowLocator.getByRole('cell').nth(index);
  }
}

export class InputCell {
  readonly locator: Locator;

  constructor(rowLocator: Locator, index: number) {
    this.locator = rowLocator.getByRole('cell').nth(index).locator('input');
  }

  async fill(value: string) {
    await this.locator.fill(value);
    await this.locator.blur();
  }
}
