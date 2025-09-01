import type { Client, CreationError, DatabaseData, DatabaseInfoData, Event, FunctionRequestTypes } from '@axonivy/database-editor-protocol';
import { Emitter } from '@axonivy/jsonrpc';
import { creationError, databaseInfoData, databases } from './data';

export class DatabaseClientMock implements Client {
  private databaseData: DatabaseData = databases;
  private databaseInfoData: DatabaseInfoData = databaseInfoData;
  private creationError: CreationError[] = creationError;

  data(): Promise<DatabaseData> {
    return Promise.resolve(this.databaseData);
  }

  databaseInfo(): Promise<DatabaseInfoData> {
    return Promise.resolve(this.databaseInfoData);
  }

  function<TFunct extends keyof FunctionRequestTypes>(
    path: TFunct,
    args: FunctionRequestTypes[TFunct][0]
  ): Promise<FunctionRequestTypes[TFunct][1]> {
    switch (path) {
      case 'function/createImportOptions':
        console.log(`Function ${path}: ${JSON.stringify(args)}`);
        return Promise.resolve(this.creationError);
      default:
        throw Error('mock function path not valid');
    }
  }

  onDataChanged: Event<void> = new Emitter<void>().event;
}
