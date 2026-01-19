import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { customRenderHook } from '../components/test-utils/test-utils';
import { useSelectedDatabaseConfig } from './database';

test('useSelectedDatabaseConfig', () => {
  const databaseConfigs = [{ name: 'config0' }, { name: 'config1' }] as Array<DatabaseConfigurationData>;
  expect(renderSelectedDatabaseConfigHook(databaseConfigs, undefined).result.current).toBeUndefined();
  expect(renderSelectedDatabaseConfigHook(databaseConfigs, 1).result.current).toEqual(databaseConfigs[1]);
});

const renderSelectedDatabaseConfigHook = (databaseConfigs: Array<DatabaseConfigurationData>, selectedDatabase?: number) =>
  customRenderHook(() => useSelectedDatabaseConfig(), { wrapperProps: { appContext: { databaseConfigs, selectedDatabase } } });
