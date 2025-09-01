import type {
  Client,
  DatabaseData,
  DatabaseEditorDataContext,
  DatabaseEditorDBContext,
  DatabaseInfoData,
  Event,
  FunctionRequestTypes,
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

  databaseInfo(context: DatabaseEditorDBContext): Promise<DatabaseInfoData> {
    return this.sendRequest('databaseInfo', context);
  }

  function<TFunct extends keyof FunctionRequestTypes>(
    path: TFunct,
    args: FunctionRequestTypes[TFunct][0]
  ): Promise<FunctionRequestTypes[TFunct][1]> {
    return this.sendRequest(path, args);
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
