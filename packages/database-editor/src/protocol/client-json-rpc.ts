import type {
  Client,
  CreationError,
  DatabaseData,
  DatabaseEditorDataContext,
  DatabaseEditorDBContext,
  DatabaseEditorTableContext,
  DatabaseImportCreationArgs,
  DatabaseTableData,
  DatabaseTableInfoData,
  Event,
  RequestTypes
} from '@axonivy/database-editor-protocol';
import { BaseRpcClient, createMessageConnection, Emitter, urlBuilder, type Connection, type MessageConnection } from '@axonivy/jsonrpc';

export class ClientJsonRpc extends BaseRpcClient implements Client {
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged: Event<void> = this.onDataChangedEmitter.event;
  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
  }

  data(context: DatabaseEditorDataContext): Promise<DatabaseData> {
    return this.sendRequest('data', context);
  }

  databaseTableNames(context: DatabaseEditorTableContext): Promise<DatabaseTableData> {
    return this.sendRequest('databaseTableNames', context);
  }

  databaseTableInfo(context: DatabaseEditorDBContext): Promise<DatabaseTableInfoData> {
    return this.sendRequest('databaseTableInfo', context);
  }

  importFromDatabase(args: DatabaseImportCreationArgs): Promise<Array<CreationError>> {
    return this.sendRequest('importFromDatabase', args);
  }

  sendRequest<K extends keyof RequestTypes>(command: K, args: RequestTypes[K][0]): Promise<RequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-database-lsp');
  }

  public static async startClient(connection: Connection): Promise<ClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<ClientJsonRpc> {
    const client = new ClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
