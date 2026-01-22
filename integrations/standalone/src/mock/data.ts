import type {
  Database,
  DatabaseColumn,
  DatabaseConfigurations,
  DatabaseData,
  DatabaseTable,
  DatabaseTableData,
  DatabaseTableInfoData,
  ImportOptions,
  JdbcDriverProperties
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

export const databaseConnections: DatabaseConfigurations = {
  helpUrl: '',
  connections: [
    {
      name: 'database0',
      driver: 'MySQL',
      icon: '',
      maxConnections: 5,
      properties: {
        'ch.ivyteam.jdbc.UserName': 'user0',
        'ch.ivyteam.jdbc.DbName': 'database0',
        'ch.ivyteam.jdbc.Port': '3306',
        'ch.ivyteam.jdbc.Host': 'host0',
        'ch.ivyteam.jdbc.Password': 'password0'
      },
      additionalProperties: {
        prop0: 'value0',
        prop1: 'value1',
        prop2: 'value2',
        prop3: 'value3'
      }
    },
    {
      name: 'database1',
      driver: 'MariaDB',
      icon: '',
      maxConnections: 10,
      properties: {
        'ch.ivyteam.jdbc.UserName': 'user1',
        'ch.ivyteam.jdbc.DbName': 'database1',
        'ch.ivyteam.jdbc.Port': '3307'
      },
      additionalProperties: {}
    },
    {
      name: 'database2',
      driver: 'HSQL Db Remote Server',
      icon: '',
      maxConnections: 20,
      properties: {
        'ch.ivyteam.jdbc.UserName': 'user2',
        'ch.ivyteam.jdbc.DbName': 'database2',
        'ch.ivyteam.jdbc.Port': '3308',
        'ch.ivyteam.jdbc.Host': 'host2',
        'ch.ivyteam.jdbc.Password': 'password2'
      },
      additionalProperties: {}
    },
    {
      name: 'otherDatabase',
      driver: '',
      icon: '',
      maxConnections: 5,
      properties: {
        'ch.ivyteam.jdbc.ConnectionUrl': 'other:connection:url',
        'ch.ivyteam.jdbc.DriverName': 'other.driver.class',
        'ch.ivyteam.jdbc.UserName': 'otherUser',
        'ch.ivyteam.jdbc.Password': 'otherPassword'
      },
      additionalProperties: {}
    }
  ]
};

export const jdbcDrivers: Array<JdbcDriverProperties> = [
  {
    name: 'MySQL',
    databaseProduct: 'MySQL',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DbName': 'string',
      'ch.ivyteam.jdbc.Port': 'number',
      'ch.ivyteam.jdbc.Host': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  },
  {
    name: 'MariaDB',
    databaseProduct: 'MariaDB',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DbName': 'string',
      'ch.ivyteam.jdbc.Port': 'number',
      'ch.ivyteam.jdbc.Host': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  },
  {
    name: 'Microsoft SQL Server',
    databaseProduct: 'Microsoft SQL Server',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DbName': 'string',
      'ch.ivyteam.jdbc.Port': 'number',
      'ch.ivyteam.jdbc.Host': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  },
  {
    name: 'HSQL Db Remote Server',
    databaseProduct: 'Hypersonic SQL Db',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DbName': 'string',
      'ch.ivyteam.jdbc.Port': 'number',
      'ch.ivyteam.jdbc.Host': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  },
  {
    name: 'HSQL Db File',
    databaseProduct: 'Hypersonic SQL Db',
    properties: {
      'ch.ivyteam.jdbc.FileName': 'string',
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  },
  {
    name: 'HSQL Db Memory',
    databaseProduct: 'Hypersonic SQL Db',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DbName': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  }
];
