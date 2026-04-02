import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAppContext } from '../../AppContext';
import { useClient } from '../../protocol/ClientContextProvider';
import { genQueryKey } from '../../query/query-client';

export const useSqlQuery = (database: DatabaseConfigurationData) => {
  const { context } = useAppContext();
  const client = useClient();
  const [sql, setSql] = useState<string | undefined>(undefined);
  const [selectedTable, setSelectedTable] = useState('');
  const [executedSql, setExecutedSql] = useState('');

  const source = selectedTable ? 'table' : executedSql ? 'sql' : 'idle';

  const lastQueryQuery = useQuery({
    queryKey: genQueryKey('loadLastQuery', { context, dataSourceId: database.name }),
    structuralSharing: false,
    queryFn: () =>
      client.functions('function/loadLastQuery', {
        context: { app: context.app, file: context.file, pmv: context.pmv },
        dataSourceId: database.name
      })
  });

  const resolvedSql = sql ?? lastQueryQuery.data ?? '';

  const tablesQuery = useQuery({
    queryKey: genQueryKey('listTables', { context, dataSourceId: database.name }),
    refetchOnMount: 'always',
    structuralSharing: false,
    queryFn: () =>
      client.functions('function/listTables', {
        context: { app: context.app, file: context.file, pmv: context.pmv },
        dataSourceId: database.name
      })
  });

  const tableContentQuery = useQuery({
    queryKey: genQueryKey('getTableContent', { context, dataSourceId: database.name, tableName: selectedTable }),
    enabled: source === 'table',
    structuralSharing: false,
    queryFn: () =>
      client.functions('function/getTableContent', {
        context: { app: context.app, file: context.file, pmv: context.pmv },
        dataSourceId: database.name,
        tableName: selectedTable
      })
  });

  const executeSqlMutation = useMutation({
    mutationKey: genQueryKey('executeSql', { context, dataSourceId: database.name }),
    mutationFn: (query: string) =>
      client.functions('function/executeSql', {
        context: { app: context.app, file: context.file, pmv: context.pmv },
        dataSourceId: database.name,
        sql: query
      }),
    onSuccess: () => tablesQuery.refetch()
  });

  const selectTable = (tableName: string) => {
    if (tableName.length === 0) {
      setSelectedTable('');
      setSql(undefined);
      setExecutedSql('');
      return;
    }
    const query = `SELECT * FROM ${tableName}`;
    setSelectedTable(tableName);
    setSql(query);
    setExecutedSql(query);
  };

  const executeSql = () => {
    if (!resolvedSql.trim()) return;
    setSelectedTable('');
    setExecutedSql(resolvedSql);
    executeSqlMutation.mutate(resolvedSql);
  };

  return {
    sql: resolvedSql,
    setSql: (value: string) => setSql(value),
    executedSql,
    selectedTable,
    selectTable,
    executeSql,
    tables: tablesQuery.data,
    isTablesLoading: tablesQuery.isPending,
    isTablesError: tablesQuery.isError,
    isLastQueryLoading: lastQueryQuery.isPending,
    result: source === 'table' ? tableContentQuery.data : source === 'sql' ? executeSqlMutation.data : undefined,
    isResultLoading: (source === 'table' && tableContentQuery.isPending) || (source === 'sql' && executeSqlMutation.isPending),
    isResultError: (source === 'table' && tableContentQuery.isError) || (source === 'sql' && executeSqlMutation.isError),
    isExecuting: executeSqlMutation.isPending
  };
};
