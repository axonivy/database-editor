import type {
  Database,
  DatabaseColumn,
  DatabaseData,
  DatabaseInfoData,
  DatabaseTable,
  ImportOptions
} from '@axonivy/database-editor-protocol';

export const databases: DatabaseData = {
  context: { app: '', pmv: '', file: '' },
  databaseNames: ['MockDatabase-001', 'MockDatabase-002', 'MockDatabase-003']
};

const columns: Array<DatabaseColumn> = [
  {
    name: 'id',
    type: 'double',
    autoIncrement: true,
    primaryKey: true
  },
  {
    name: 'userId',
    type: 'varchar',
    autoIncrement: false,
    primaryKey: false
  },
  {
    name: 'firstName',
    type: 'varchar',
    autoIncrement: false,
    primaryKey: false
  },
  {
    name: 'lastName',
    type: 'varchar',
    autoIncrement: false,
    primaryKey: false
  }
];

const tables: Array<DatabaseTable> = [
  {
    name: 'Users-001',
    columns: columns
  },
  {
    name: 'Users-002',
    columns: columns
  },
  {
    name: 'Users-003',
    columns: columns
  }
];

export const databaseInfoData: DatabaseInfoData = {
  connectionName: 'MockDatabase-001',
  tables: tables
};

export const creationError: Database['creationError'] = [];

export const mockError: Database['creationError'] = [
  {
    name: 'Users-001',
    message: 'Users-001',
    type: 0 as unknown as ImportOptions
  }
];
