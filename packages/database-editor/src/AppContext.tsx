import {
  type DatabaseConfigurationData,
  type DatabaseConfigurations,
  type DatabaseEditorContext,
  type EditorFileContent
} from '@axonivy/database-editor-protocol';
import type { UseMutateFunction } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

type AppContext = {
  context: DatabaseEditorContext;
  selectedDatabase?: number;
  setSelectedDatabase: (index?: number) => void;
  projects: Array<string>;
  databaseConfigs: Array<DatabaseConfigurationData>;
  setData: UseMutateFunction<EditorFileContent, Error, DatabaseConfigurations, unknown>;
};

const appContext = createContext<AppContext>({
  context: { app: '', pmv: '', file: '' },
  selectedDatabase: undefined,
  setSelectedDatabase: () => {},
  projects: [],
  databaseConfigs: [],
  setData: () => {}
});

export const AppProvider = appContext.Provider;

export function useAppContext(): AppContext {
  return useContext(appContext);
}
