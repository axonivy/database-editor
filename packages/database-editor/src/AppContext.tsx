import {
  type DatabaseConfig,
  type Databaseconfigs,
  type DatabaseEditorContext,
  type EditorFileContent,
  type JdbcDriverProperties
} from '@axonivy/database-editor-protocol';
import type { UseMutateFunction } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

type AppContext = {
  context: DatabaseEditorContext;
  selectedDatabase?: number;
  setSelectedDatabase: (index?: number) => void;
  projects: Array<string>;
  databaseConfigs: Array<DatabaseConfig>;
  setData: UseMutateFunction<EditorFileContent, Error, Databaseconfigs, unknown>;
  jdbcDrivers: Array<JdbcDriverProperties>;
};

const appContext = createContext<AppContext>({
  context: { app: '', pmv: '', file: '' },
  selectedDatabase: undefined,
  setSelectedDatabase: () => {},
  projects: [],
  databaseConfigs: [],
  setData: () => {},
  jdbcDrivers: []
});

export const AppProvider = appContext.Provider;

export function useAppContext(): AppContext {
  return useContext(appContext);
}
