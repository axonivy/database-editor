import type { DatabaseConnectionData } from '@axonivy/database-editor-protocol';
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
  const UNDEFINED_DB: DatabaseConnectionData = { name: '', connectionProperties: {}, maxConnections: 0 };
  const { activeDb, setActiveDb } = useAppContext();

  const createConnection = (name: string) => {
    const connection: DatabaseConnectionData = {
      name,
      maxConnections: 5,
      connectionProperties: {
        'Driver Class': jdbcDrivers?.at(0)?.name
      }
    };
    setActiveDb(connection);
    return saveFunction.mutate(connection);
  };

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

  const deleteFunction = useMutation({
    mutationKey: genQueryKey('deleteDatabaseConnection', {
      context: context,
      connectionName: activeDb?.name ?? ''
    }),
    mutationFn: () =>
      client.deleteDatabaseConnection({
        context,
        connectionName: activeDb?.name ?? ''
      }),
    onSuccess: () => databaseQuery.refetch(),
    onError: error => console.log('error', error)
  });

  return { jdbcDrivers, UNDEFINED_DB, saveFunction, createConnection, deleteFunction, databaseQuery };
};
