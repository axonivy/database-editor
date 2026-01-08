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
  connections: [
    {
      properties: {
        'ch.ivyteam.jdbc.DriverName': 'sun.jdbc.odbc.JdbcOdbcDriver',
        'ch.ivyteam.jdbc.UserName': 'userName',
        'ch.ivyteam.jdbc.DatabaseName': 'databaseName',
        'ch.ivyteam.jdbc.Port': '3306',
        'ch.ivyteam.jdbc.Host': 'localhost',
        'ch.ivyteam.jdbc.Password': 'password',
        'ch.ivyteam.jdbc.ODBC': 'odbc'
      },
      additionalProperties: {
        prop1: 'value1',
        prop2: 'value2',
        prop3: 'value3',
        prop4: 'value4'
      },
      name: 'TestDatabaseConnection-001',
      driver: 'com.mysql.cj.jdbc.Driver',
      icon: '',
      maxConnections: 1
    },
    {
      properties: {
        'ch.ivyteam.jdbc.DriverName': 'sun.jdbc.odbc.JdbcOdbcDriver',
        'ch.ivyteam.jdbc.UserName': 'userName',
        'ch.ivyteam.jdbc.DatabaseName': 'databaseName',
        'ch.ivyteam.jdbc.Port': '3306',
        'ch.ivyteam.jdbc.Host': 'localhost',
        'ch.ivyteam.jdbc.Password': 'password',
        'ch.ivyteam.jdbc.ODBC': 'odbc'
      },
      additionalProperties: {},
      name: 'TestDatabaseConnection-002',
      driver: 'com.mysql.cj.jdbc.Driver',
      icon: '',
      maxConnections: 1
    },
    {
      properties: {
        'ch.ivyteam.jdbc.DriverName': 'sun.jdbc.odbc.JdbcOdbcDriver',
        'ch.ivyteam.jdbc.UserName': 'userName',
        'ch.ivyteam.jdbc.DatabaseName': 'databaseName',
        'ch.ivyteam.jdbc.Port': '3306',
        'ch.ivyteam.jdbc.Host': 'localhost',
        'ch.ivyteam.jdbc.Password': 'password',
        'ch.ivyteam.jdbc.ODBC': 'odbc'
      },
      additionalProperties: {
        prop1: 'value1',
        prop2: 'value2',
        prop3: 'value3',
        prop4: 'value4'
      },
      name: 'TestDatabaseConnection-003',
      driver: 'com.mysql.cj.jdbc.Driver',
      icon: '',
      maxConnections: 1
    }
  ]
};

export const jdbcDrivers: Array<JdbcDriverProperties> = [
  {
    name: 'com.mysql.cj.jdbc.Driver',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DatabaseName': 'string',
      'ch.ivyteam.jdbc.Port': 'number',
      'ch.ivyteam.jdbc.Host': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  },
  {
    name: 'org.mariadb.jdbc.Driver',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DatabaseName': 'string',
      'ch.ivyteam.jdbc.Port': 'number'
    }
  },
  {
    name: 'net.sourceforge.jtds.jdbc.Driver',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DatabaseName': 'string',
      'ch.ivyteam.jdbc.Port': 'number',
      'ch.ivyteam.jdbc.Host': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  },
  {
    name: 'com.sybase.jdbc3.jdbc.SybDriver',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DatabaseName': 'string',
      'ch.ivyteam.jdbc.Port': 'number',
      'ch.ivyteam.jdbc.Host': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  },
  {
    name: 'com.ibm.db2.jcc.DB2Driver',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DatabaseName': 'string',
      'ch.ivyteam.jdbc.Port': 'number',
      'ch.ivyteam.jdbc.Host': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  },
  {
    name: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    properties: {
      'ch.ivyteam.jdbc.UserName': 'string',
      'ch.ivyteam.jdbc.DatabaseName': 'string',
      'ch.ivyteam.jdbc.Port': 'number',
      'ch.ivyteam.jdbc.Host': 'string',
      'ch.ivyteam.jdbc.Password': 'string'
    }
  }
];
