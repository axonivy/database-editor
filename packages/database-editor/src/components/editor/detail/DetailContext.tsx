import type { DatabaseConfigurationData, JdbcDriverProperties } from '@axonivy/database-editor-protocol';
import { createContext, useContext } from 'react';

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
