import type {
  Database,
  DatabaseColumn,
  DatabaseConnectionData,
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

export const conenctions: Array<DatabaseConnectionData> = [
  {
    name: 'mock-connection-001',
    maxConnections: 5,
    connectionProperties: {
      User: 'test',
      'Database Name': 'mock-database-001',
      Port: '3306',
      Host: 'localhost',
      'Driver Class': 'com.mysql.cj.jdbc.Driver',
      Password: 'test'
    }
  },
  {
    name: 'mock-connection-002',
    maxConnections: 5,
    connectionProperties: {
      User: 'test',
      'Database Name': 'mock-database-002',
      Port: '3306',
      Host: '9.9.9.9',
      'Driver Class': 'com.mysql.cj.jdbc.Driver',
      Password: 'test'
    }
  }
];

export const jdbcDrivers: Array<JdbcDriverProperties> = [
  {
    name: 'com.mysql.cj.jdbc.Driver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  },
  {
    name: 'org.mariadb.jdbc.Driver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  },
  {
    name: 'net.sourceforge.jtds.jdbc.Driver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  },
  {
    name: 'com.sybase.jdbc3.jdbc.SybDriver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  },
  {
    name: 'com.ibm.db2.jcc.DB2Driver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  },
  {
    name: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  },
  {
    name: 'net.sourceforge.jtds.jdbc.Driver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  },
  {
    name: 'com.inet.tds.TdsDriver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  },
  { name: 'sun.jdbc.odbc.JdbcOdbcDriver', properties: { 'ODBC Name': 'string', User: 'string', Password: 'string' } },
  {
    name: 'oracle.jdbc.OracleDriver',
    properties: {
      User: 'string',
      'Oracle Service Name': 'string',
      'Oracle Service ID (SID)': 'string',
      Port: 'number',
      Host: 'string',
      'Oracle LDAP Name': 'string',
      'Oracle LDAPS Name': 'string',
      Password: 'string',
      'Oracle TNS': 'string'
    }
  },
  { name: 'org.hsqldb.jdbc.JDBCDriver', properties: { User: 'string', 'Database Name': 'string', Password: 'string' } },
  {
    name: 'org.hsqldb.jdbc.JDBCDriver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  },
  {
    name: 'com.ibm.as400.access.AS400JDBCDriver',
    properties: { User: 'string', Port: 'number', Schema: 'string', Host: 'string', Password: 'string' }
  },
  {
    name: 'org.postgresql.Driver',
    properties: { User: 'string', 'Database Name': 'string', Port: 'number', Host: 'string', Password: 'string' }
  }
];
