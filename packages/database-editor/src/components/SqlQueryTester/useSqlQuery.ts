import type { DatabaseConfigurationData, ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAppContext } from '../../AppContext';
import { useClient } from '../../protocol/ClientContextProvider';
import { genQueryKey } from '../../query/query-client';

type ResultSource = 'table' | 'sql' | 'idle';

export const useSqlQuery = (database: DatabaseConfigurationData) => {
  const { context } = useAppContext();
  const client = useClient();
  const [sqlOverride, setSql] = useState<string | undefined>(undefined);
  const [executedSql, setExecutedSql] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [resultSource, setResultSource] = useState<ResultSource>('idle');

  const lastQueryQuery = useQuery({
    queryKey: genQueryKey('loadLastQuery', { context, dataSourceId: database.name }),
    structuralSharing: false,
    queryFn: () =>
      client.functions('function/loadLastQuery', {
        context: { app: context.app, file: context.file, pmv: context.pmv },
        dataSourceId: database.name
      })
  });

  const sql = sqlOverride ?? lastQueryQuery.data ?? '';

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
    enabled: selectedTable.length > 0,
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
    onSuccess: () => {
      tablesQuery.refetch();
    }
  });

  const selectTable = (tableName: string) => {
    setSelectedTable(tableName);
    if (tableName.length === 0) {
      setSql('');
      setResultSource('idle');
      return;
    }
    const query = `SELECT * FROM ${tableName}`;
    setSql(query);
    setExecutedSql(query);
    setResultSource('table');
  };

  const executeSql = () => {
    setExecutedSql(sql);
    setResultSource('sql');
    executeSqlMutation.mutate(sql);
  };

  const result = deriveResult(
    resultSource,
    tableContentQuery.isSuccess ? tableContentQuery.data : undefined,
    executeSqlMutation.isSuccess ? executeSqlMutation.data : undefined
  );
  const isResultLoading =
    (resultSource === 'table' && tableContentQuery.isPending) || (resultSource === 'sql' && executeSqlMutation.isPending);
  const isResultError = (resultSource === 'table' && tableContentQuery.isError) || (resultSource === 'sql' && executeSqlMutation.isError);

  return {
    sql,
    setSql,
    executedSql,
    selectedTable,
    selectTable,
    executeSql,
    tables: tablesQuery.data,
    isTablesLoading: tablesQuery.isPending,
    isTablesError: tablesQuery.isError,
    result,
    isResultLoading,
    isResultError,
    isExecuting: executeSqlMutation.isPending
  };
};

const deriveResult = (
  source: ResultSource,
  tableContent: ExecuteSqlResponse | undefined,
  sqlResult: ExecuteSqlResponse | undefined
): ExecuteSqlResponse | undefined => {
  switch (source) {
    case 'table':
      return tableContent;
    case 'sql':
      return sqlResult;
    default:
      return undefined;
  }
};
