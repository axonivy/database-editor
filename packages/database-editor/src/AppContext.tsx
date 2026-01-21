import {
  type DatabaseConfigurationData,
  type DatabaseConfigurations,
  type DatabaseEditorContext,
  type JdbcDriverProperties
} from '@axonivy/database-editor-protocol';
import type { UpdateConsumer, useHistoryData } from '@axonivy/ui-components';
import { createContext, useContext } from 'react';

type AppContext = {
  context: DatabaseEditorContext;
  selectedDatabase?: number;
  setSelectedDatabase: (index?: number) => void;
  projects: Array<string>;
  databaseConfigs: Array<DatabaseConfigurationData>;
  setData: UpdateConsumer<DatabaseConfigurations>;
  history: ReturnType<typeof useHistoryData<DatabaseConfigurations>>;
};

const appContext = createContext<AppContext>({
  context: { app: '', pmv: '', file: '' },
  selectedDatabase: undefined,
  setSelectedDatabase: () => {},
  projects: [],
  databaseConfigs: [],
  setData: () => {},
  history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false }
});

export const AppProvider = appContext.Provider;

export function useAppContext(): AppContext & { setUnhistorisedDataClass: UpdateConsumer<DatabaseConfigurations> } {
  const context = useContext(appContext);
  return {
    ...context,
    setData: updater => {
      context.setData(prev => {
        const newData = updater(prev);
        context.history.push(newData);
        return newData;
      });
    },
    setUnhistorisedDataClass: context.setData
  };
}

type DetailContext = {
  databaseConfig: DatabaseConfigurationData;
  updateDatabaseConfig: (propertyUpdater: (database: DatabaseConfigurationData) => void) => void;
  drivers: Array<JdbcDriverProperties>;
  selectedDriver: JdbcDriverProperties;
};

const detailContext = createContext<DetailContext>({
  databaseConfig: { name: '', driver: '', icon: '', maxConnections: 0, properties: {}, additionalProperties: {} },
  updateDatabaseConfig: () => {},
  drivers: [],
  selectedDriver: { name: '', databaseProduct: '', properties: {} }
});

export const DetailProvider = detailContext.Provider;

export function useDetailContext(): DetailContext {
  return useContext(detailContext);
}
