import type { DatabaseColumn } from '@axonivy/database-editor-protocol';
import { generateColumns } from './TableData';

test('generateColumns', () => {
  const column = generateColumns(columns);
  expect(column).toBe('id, userId, firstName, lastName');
});

const columns: Array<DatabaseColumn> = [
  {
    name: 'id',
    type: 'double'
  },
  {
    name: 'userId',
    type: 'varchar'
  },
  {
    name: 'firstName',
    type: 'varchar'
  },
  {
    name: 'lastName',
    type: 'varchar'
  }
];
