import type {
  Database,
  DatabaseColumn,
  DatabaseData,
  DatabaseTable,
  DatabaseTableData,
  DatabaseTableInfoData,
  ImportOptions
} from '@axonivy/database-editor-protocol';

export const databases: DatabaseData = {
  context: { app: '', pmv: '', file: '' },
  databaseNames: {
    ['project1-name']: ['MockDatabase-001', 'MockDatabase-002', 'MockDatabase-003'],
    ['project2-name']: ['MockDatabase-001', 'MockDatabase-002', 'MockDatabase-003']
  }
};

const columns: Array<DatabaseColumn> = [
  {
    name: 'id',
    type: 'double',
    entityAttributeName: 'id',
    entityAttributeType: 'double',
    autoIncrement: true,
    primaryKey: true,
    generate: true
  },
  {
    name: 'userId',
    type: 'varchar',
    entityAttributeName: 'userId',
    entityAttributeType: 'String',
    autoIncrement: false,
    primaryKey: false,
    generate: true
  },
  {
    name: 'firstName',
    type: 'varchar',
    entityAttributeName: 'firstName',
    entityAttributeType: 'String',
    autoIncrement: false,
    primaryKey: false,
    generate: true
  },
  {
    name: 'lastName',
    type: 'varchar',
    entityAttributeName: 'lastName',
    entityAttributeType: 'String',
    autoIncrement: false,
    primaryKey: false,
    generate: true
  }
];

const tableNames: Array<string> = ['Users-001', 'Users-002', 'Users-003'];

export const databaseTableData: DatabaseTableData = {
  connectionName: 'MockDatabase-001',
  tables: tableNames
};

const tables: Array<DatabaseTable> = [
  {
    name: 'Users-001',
    entityClassName: 'Users001',
    columns: columns
  },
  {
    name: 'Users-002',
    entityClassName: 'Users002',
    columns: columns
  },
  {
    name: 'Users-003',
    entityClassName: 'Users003',
    columns: columns
  }
];

export const databaseTableInfoData: DatabaseTableInfoData = {
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
