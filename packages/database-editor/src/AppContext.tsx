import type { DatabaseConnectionData, DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

type AppContext = {
  context: DatabaseEditorContext;
  activeDb: DatabaseConnectionData | undefined;
  setActiveDb: Dispatch<SetStateAction<DatabaseConnectionData | undefined>>;
  projects: Array<string>;
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
  const [activeDb, setActiveDb] = useState<DatabaseConnectionData>();
  return <AppContext.Provider value={{ context, activeDb, setActiveDb, projects }}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContext {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside <AppProvider>');
  }
  return ctx;
}
