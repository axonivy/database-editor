import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { customRenderHook } from '../../test-utils/test-utils';
import { useValidateDatabaseConnectionKey } from './AddDatabaseConnectionDialog';

test('useValidateDatabaseConnectionName', () => {
  const databaseConfigs = [{ key: 'existing0' }, { key: 'existing1' }] as Array<DatabaseConfigurationData>;
  expect(renderValidateDatabaseConnectionNameHook('', databaseConfigs).result.current).toEqual({
    message: 'Name cannot be empty.',
    variant: 'error'
  });
  expect(renderValidateDatabaseConnectionNameHook('existing1', databaseConfigs).result.current).toEqual({
    message: 'Name is already taken.',
    variant: 'error'
  });
  expect(renderValidateDatabaseConnectionNameHook('valid', databaseConfigs).result.current).toBeUndefined();
});

const renderValidateDatabaseConnectionNameHook = (name: string, databaseConfigs: Array<DatabaseConfigurationData>) =>
  customRenderHook(() => useValidateDatabaseConnectionKey(name), { wrapperProps: { appContext: { databaseConfigs } } });
