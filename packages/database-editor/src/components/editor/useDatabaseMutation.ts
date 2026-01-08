import type { Databaseconfigs } from '@axonivy/database-editor-protocol';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAppContext } from '../../AppContext';
import { useClient } from '../../protocol/ClientContextProvider';
import { useMeta } from '../../protocol/use-meta';
import { genQueryKey } from '../../query/query-client';

export const useDatabaseMutation = () => {
  const { context } = useAppContext();
  const client = useClient();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined).data;
  const { data, setData } = useAppContext();

  const getData = () => {
    dataQuery.refetch().then(result => setData(result.data));
    return data;
  };

  const dataQuery = useQuery({
    queryKey: useMemo(() => genQueryKey('databaseConnections', context), [context]),
    queryFn: async () => {
      return await client.data(context);
    },
    structuralSharing: false
  });

  const saveQuery = useMutation({
    mutationKey: genQueryKey('saveDatabaseConnection', {
      context: context,
      data: data
    }),
    mutationFn: (data: Databaseconfigs) =>
      client.save({
        context,
        data,
        directSave: true
      }),
    onSuccess: () => getData(),
    onError: error => console.log('error', error)
  });

  return { jdbcDrivers, dataQuery, saveQuery };
};
