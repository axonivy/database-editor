import type { DatabaseConnectionData, DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useClient } from '../../protocol/ClientContextProvider';
import { useMeta } from '../../protocol/use-meta';
import { genQueryKey } from '../../query/query-client';

export const useDatabaseMutation = (context: DatabaseEditorContext) => {
  const client = useClient();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined).data;
  const [activeDb, setActiveDb] = useState<DatabaseConnectionData>();
  const UNDEFINED_DB = { name: '', connectionProperties: {} };

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

  return { jdbcDrivers, activeDb, setActiveDb, UNDEFINED_DB, saveFunction, databaseQuery, databaseTest };
};
