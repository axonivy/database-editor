import type { DatabaseConnectionData, DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { createContext, useContext, useState, type ReactNode } from 'react';

type AppContext = {
  context: DatabaseEditorContext;
  activeDb: DatabaseConnectionData | undefined;
  setActiveDb: (db: DatabaseConnectionData | undefined) => void;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export function AppProvider({ context, children }: { context: DatabaseEditorContext; children: ReactNode }) {
  const [activeDb, setActiveDb] = useState<DatabaseConnectionData>();

  return <AppContext.Provider value={{ context, activeDb, setActiveDb }}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContext {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside <AppProvider>');
  }
  return ctx;
}
