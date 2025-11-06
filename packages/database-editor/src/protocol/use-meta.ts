import type { MetaRequestTypes } from '@axonivy/database-editor-protocol';
import { useQuery } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import { useClient } from './ClientContextProvider';

export const useMeta = <TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]) => {
  const client = useClient();
  return useQuery({
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args),
    structuralSharing: false
  });
};
