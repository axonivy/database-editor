import { type DatabaseConfigurationData, type DatabaseConfigurations, type DatabaseEditorContext } from '@axonivy/database-editor-protocol';
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
