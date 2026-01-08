import { type DatabaseConfig, type Databaseconfigs, type DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';

type AppContext = {
  context: DatabaseEditorContext;
  activeDb: DatabaseConfig | undefined;
  setActiveDb: Dispatch<SetStateAction<DatabaseConfig | undefined>>;
  projects: Array<string>;
  data: Databaseconfigs | undefined;
  setData: Dispatch<SetStateAction<Databaseconfigs | undefined>>;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export function AppProvider({
  context,
  projects,
  children
}: {
  context: DatabaseEditorContext;
  projects: Array<string>;
  children: ReactNode;
}) {
  const client = useClient();

  const dataQuery = useQuery({
    queryKey: useMemo(() => genQueryKey('databaseConnections', context), [context]),
    queryFn: async () => {
      return await client.data(context);
    },
    structuralSharing: false
  });

  const [activeDb, setActiveDb] = useState<DatabaseConfig>();
  const [data, setData] = useState<Databaseconfigs | undefined>(dataQuery.data);
  return <AppContext.Provider value={{ context, activeDb, setActiveDb, data, setData, projects }}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContext {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside <AppProvider>');
  }
  return ctx;
}
