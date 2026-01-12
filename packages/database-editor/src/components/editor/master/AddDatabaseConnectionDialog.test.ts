import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { customRenderHook } from '../../test-utils/test-utils';
import { useValidateDatabaseConnectionName } from './AddDatabaseConnectionDialog';

test('useValidateDatabaseConnectionName', () => {
  const databaseConfigs = [{ name: 'existing0' }, { name: 'existing1' }] as Array<DatabaseConfigurationData>;
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
  customRenderHook(() => useValidateDatabaseConnectionName(name), { wrapperProps: { appContext: { databaseConfigs } } });
