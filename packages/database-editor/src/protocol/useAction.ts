import type { DatabaseActionArgs } from '@axonivy/database-editor-protocol';
import { useAppContext } from '../AppContext';
import { useClient } from '../protocol/ClientContextProvider';

export function useAction(actionId: DatabaseActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: DatabaseActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
