import { useAppContext } from '../AppContext';

export const useSelectedDatabaseConfig = () => {
  const { databaseConfigs, selectedDatabase } = useAppContext();
  return selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;
};
