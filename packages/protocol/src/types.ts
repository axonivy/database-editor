import type {
  CreationError,
  DatabaseConnectionData,
  DatabaseConnectionDeleteArgs,
  DatabaseConnectionSaveArgs,
  DatabaseData,
  DatabaseEditorDataContext,
  DatabaseEditorDBContext,
  DatabaseEditorTableContext,
  DatabaseImportCreationArgs,
  DatabaseTableData,
  DatabaseTableInfoData,
  JdbcDriverProperties
} from './editor';

export type ImportWizardContext = {
  app: string;
  file: string;
  projects: Array<string>;
};

export type DatabaseEditorContext = DatabaseEditorDBContext | DatabaseEditorDataContext;

export type EditorProps = { context: ImportWizardContext; directSave?: boolean };

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface RequestTypes extends MetaRequestTypes {
  data: [DatabaseEditorDataContext, DatabaseData];
  databaseTableNames: [DatabaseEditorTableContext, DatabaseTableData];
  databaseTableInfo: [DatabaseEditorDBContext, DatabaseTableInfoData];
  databaseConnections: [DatabaseEditorDataContext, Array<DatabaseConnectionData>];
  importFromDatabase: [DatabaseImportCreationArgs, Array<CreationError>];
  saveDatabaseConnection: [DatabaseConnectionSaveArgs, boolean];
  deleteDatabaseConnection: [DatabaseConnectionDeleteArgs, boolean];
}

export interface Client {
  data(context: DatabaseEditorDataContext): Promise<DatabaseData>;
  databaseConnections(context: DatabaseEditorDataContext): Promise<Array<DatabaseConnectionData>>;
  importFromDatabase(args: DatabaseImportCreationArgs): Promise<Array<CreationError>>;
  onDataChanged: Event<void>;
  saveDatabaseConnection(args: DatabaseConnectionSaveArgs): Promise<boolean>;
  deleteDatabaseConnection(args: DatabaseConnectionDeleteArgs): Promise<boolean>;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;
}

export interface MetaRequestTypes {
  'meta/databaseTableNames': [DatabaseEditorTableContext, DatabaseTableData];
  'meta/databaseTableInfo': [DatabaseEditorDBContext, DatabaseTableInfoData];
  'meta/jdbcDrivers': [undefined, Array<JdbcDriverProperties>];
}

export interface ClientContext {
  client: Client;
}

export const ImportOptionsLookup = {
  0: 'EntityClass',
  1: 'FormDialog',
  2: 'Repository',
  3: 'Enum'
};
