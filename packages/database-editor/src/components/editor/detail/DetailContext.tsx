import type { DatabaseConfigurationData, JdbcDriverProperties } from '@axonivy/database-editor-protocol';
import { createContext, use } from 'react';

type DetailContext = {
  databaseConfig: DatabaseConfigurationData;
  updateDatabaseConfig: (propertyUpdater: (database: DatabaseConfigurationData) => void) => void;
  drivers: Array<JdbcDriverProperties>;
  selectedDriver: JdbcDriverProperties;
};

const DetailContext = createContext<DetailContext>({
  databaseConfig: { key: '', name: '', driver: '', icon: '', maxConnections: 0, properties: {}, additionalProperties: {} },
  updateDatabaseConfig: () => {},
  drivers: [],
  selectedDriver: { name: '', databaseProduct: '', properties: {} }
});

export const DetailProvider = DetailContext.Provider;

export function useDetailContext(): DetailContext {
  return use(DetailContext);
}
