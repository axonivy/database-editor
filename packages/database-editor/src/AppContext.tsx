import { type DatabaseConfigurationData, type DatabaseConfigurations, type DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import type { UpdateConsumer } from '@axonivy/ui-components';
import { createContext, useContext } from 'react';

type AppContext = {
  context: DatabaseEditorContext;
  selectedDatabase?: number;
  setSelectedDatabase: (index?: number) => void;
  projects: Array<string>;
  databaseConfigs: Array<DatabaseConfigurationData>;
  setData: UpdateConsumer<DatabaseConfigurations>;
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
