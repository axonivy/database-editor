import {
  type DatabaseConfig,
  type Databaseconfigs,
  type DatabaseEditorContext,
  type EditorFileContent,
  type JdbcDriverProperties
} from '@axonivy/database-editor-protocol';
import type { UseMutateFunction } from '@tanstack/react-query';
import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

type AppContext = {
  context: DatabaseEditorContext;
  activeDb: DatabaseConfig | undefined;
  setActiveDb: Dispatch<SetStateAction<DatabaseConfig | undefined>>;
  projects: Array<string>;
  data: Databaseconfigs | undefined;
  setData: UseMutateFunction<EditorFileContent, Error, Databaseconfigs, unknown>;
  jdbcDrivers: Array<JdbcDriverProperties>;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export function AppProvider({
  context,
  data,
  setData,
  projects,
  children,
  jdbcDrivers
}: {
  context: DatabaseEditorContext;
  projects: Array<string>;
  children: ReactNode;
  data: Databaseconfigs;
  setData: UseMutateFunction<EditorFileContent, Error, Databaseconfigs, unknown>;
  jdbcDrivers: Array<JdbcDriverProperties>;
}) {
  const [activeDb, setActiveDb] = useState<DatabaseConfig>();

  return (
    <AppContext.Provider value={{ context, activeDb, setActiveDb, data, setData, projects, jdbcDrivers }}>{children}</AppContext.Provider>
  );
}

export function useAppContext(): AppContext {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside <AppProvider>');
  }
  return ctx;
}
