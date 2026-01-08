import {
  type DatabaseConfigurationData,
  type DatabaseConfigurations,
  type DatabaseEditorContext,
  type EditorFileContent
} from '@axonivy/database-editor-protocol';
import type { UseMutateFunction } from '@tanstack/react-query';
import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

type AppContext = {
  context: DatabaseEditorContext;
  activeDb: DatabaseConfigurationData | undefined;
  setActiveDb: Dispatch<SetStateAction<DatabaseConfigurationData | undefined>>;
  projects: Array<string>;
  data: DatabaseConfigurations | undefined;
  setData: UseMutateFunction<EditorFileContent, Error, DatabaseConfigurations, unknown>;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export function AppProvider({
  context,
  data,
  setData,
  projects,
  children
}: {
  context: DatabaseEditorContext;
  projects: Array<string>;
  children: ReactNode;
  data: DatabaseConfigurations;
  setData: UseMutateFunction<EditorFileContent, Error, DatabaseConfigurations, unknown>;
}) {
  const [activeDb, setActiveDb] = useState<DatabaseConfigurationData>();

  return <AppContext.Provider value={{ context, activeDb, setActiveDb, data, setData, projects }}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContext {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside <AppProvider>');
  }
  return ctx;
}
