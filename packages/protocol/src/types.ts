import type {
  CreationError,
  DatabaseData,
  DatabaseEditorDataContext,
  DatabaseEditorDBContext,
  DatabaseImportCreationArgs,
  DatabaseInfoData
} from './editor';

export type DatabaseEditorContext = DatabaseEditorDBContext | DatabaseEditorDataContext;

export type EditorProps = { context: DatabaseEditorContext; directSave?: boolean };

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface RequestTypes extends FunctionRequestTypes {
  data: [DatabaseEditorDataContext, DatabaseData];
  databaseInfo: [DatabaseEditorDBContext, DatabaseInfoData];
}

export interface Client {
  data(context: DatabaseEditorDataContext): Promise<DatabaseData>;
  databaseInfo(context: DatabaseEditorDBContext): Promise<DatabaseInfoData>;
  onDataChanged: Event<void>;
  function<TFunct extends keyof FunctionRequestTypes>(
    path: TFunct,
    args: FunctionRequestTypes[TFunct][0]
  ): Promise<FunctionRequestTypes[TFunct][1]>;
}

export interface ClientContext {
  client: Client;
}

export interface FunctionRequestTypes {
  'function/createImportOptions': [DatabaseImportCreationArgs, Array<CreationError>];
}
