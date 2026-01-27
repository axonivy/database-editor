import type {
  CreationError,
  DatabaseConfigurationData,
  DatabaseConfigurations,
  DatabaseData,
  DatabaseEditorDataContext,
  DatabaseEditorDBContext,
  DatabaseEditorSaveArgs,
  DatabaseEditorTableContext,
  DatabaseImportCreationArgs,
  DatabaseTableData,
  DatabaseTableInfoData,
  DatabaseTestArgs,
  EditorFileContent,
  JdbcDriverProperties,
  MapStringConnectionTestData
} from './editor';

export const UNDEFINED_CONNECTION: DatabaseConfigurationData = {
  name: 'UNDEFINED',
  driver: 'UNDEFINED',
  maxConnections: 10,
  icon: 'UNDEFINED',
  properties: {},
  additionalProperties: {}
};

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

export interface RequestTypes extends MetaRequestTypes, FunctionRequestTypes {
  data: [DatabaseEditorDataContext, DatabaseConfigurations];
  save: [DatabaseEditorSaveArgs, EditorFileContent];
}

export interface NotificationTypes {
  action: DatabaseActionArgs;
}

export interface Client {
  data(context: DatabaseEditorDataContext): Promise<DatabaseConfigurations>;
  save(args: DatabaseEditorSaveArgs): Promise<EditorFileContent>;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;
  functions<TFunction extends keyof FunctionRequestTypes>(
    Path: TFunction,
    args: FunctionRequestTypes[TFunction][0]
  ): Promise<FunctionRequestTypes[TFunction][1]>;
  action(action: DatabaseActionArgs): void;

  onDataChanged: Event<void>;
}

export interface FunctionRequestTypes {
  'function/importFromDatabase': [DatabaseImportCreationArgs, Array<CreationError>];
  'function/testDatabaseConnection': [DatabaseTestArgs, MapStringConnectionTestData];
}

export interface MetaRequestTypes {
  'meta/allDatabaseNames': [DatabaseEditorDataContext, DatabaseData];
  'meta/databaseTableNames': [DatabaseEditorTableContext, DatabaseTableData];
  'meta/databaseTableInfo': [DatabaseEditorDBContext, DatabaseTableInfoData];
  'meta/jdbcDrivers': [DatabaseEditorDataContext, Array<JdbcDriverProperties>];
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

export interface DatabaseActionArgs {
  actionId: 'openUrl';
  context: DatabaseEditorDataContext;
  payload: string;
}
