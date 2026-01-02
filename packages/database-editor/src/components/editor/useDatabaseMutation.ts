import type { DatabaseConnectionData, DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAppContext } from '../../AppContext';
import { useClient } from '../../protocol/ClientContextProvider';
import { useMeta } from '../../protocol/use-meta';
import { genQueryKey } from '../../query/query-client';

export const useDatabaseMutation = (context: DatabaseEditorContext) => {
  const client = useClient();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined).data;
  const UNDEFINED_DB = { name: '', connectionProperties: {} };
  const { activeDb } = useAppContext();

  const databaseQuery = useQuery({
    queryKey: useMemo(() => genQueryKey('databaseConnections', context), [context]),
    queryFn: async () => {
      return await client.databaseConnections(context);
    },
    structuralSharing: false
  });

  const saveFunction = useMutation({
    mutationKey: genQueryKey('saveDatabaseConnection', {
      context: context,
      data: activeDb?.name ?? ''
    }),
    mutationFn: (data: DatabaseConnectionData) =>
      client.saveDatabaseConnection({
        context,
        data
      }),
    onSuccess: () => databaseQuery.refetch(),
    onError: error => console.log('error', error)
  });

  const databaseTest = useQuery({
    queryKey: useMemo(() => genQueryKey('testDatabaseConnection', context, activeDb?.name), [activeDb?.name, context]),
    queryFn: async () => {
      return await client.testDatabaseConnection({ context, databaseConnectionName: activeDb?.name ?? '' });
    },
    structuralSharing: false
  });

  return { jdbcDrivers, UNDEFINED_DB, saveFunction, databaseQuery, databaseTest };
};
