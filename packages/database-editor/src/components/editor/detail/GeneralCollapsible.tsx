import {
  BasicField,
  BasicInput,
  BasicSelect,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  Flex
} from '@axonivy/ui-components';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useMeta } from '../../../protocol/use-meta';
import { useValidations } from '../../../protocol/useValidations';
import { fieldMessage } from './DatabaseDetail';
import { useDetailContext } from './DetailContext';

export const GeneralCollapsible = () => {
  const { t } = useTranslation();
  const { databaseConfig, updateDatabaseConfig, drivers, selectedDriver } = useDetailContext();
  const { context } = useAppContext();
  const validations = useValidations(databaseConfig?.key ?? '');
  const iconMeta = useMeta('meta/icons/all', context);
  const iconOptions = useMemo(
    () => iconMeta.data?.map(icon => ({ icon: icon.path, label: icon.name, value: icon.relativePath })) ?? [],
    [iconMeta.data]
  );
  const databaseProductItems = useMemo(
    () =>
      Array.from(new Set(drivers.map(driver => driver.databaseProduct)))
        .map(product => ({ label: product, value: product }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [drivers]
  );

  const driversForDatabaseProduct = useCallback(
    (databaseProduct: string) =>
      drivers.filter(driver => driver.databaseProduct === databaseProduct).sort((a, b) => a.name.localeCompare(b.name)),
    [drivers]
  );

  const driverItems = useMemo(
    () => driversForDatabaseProduct(selectedDriver.databaseProduct).map(driver => ({ label: driver.name, value: driver.name })),
    [selectedDriver.databaseProduct, driversForDatabaseProduct]
  );
  const keyMessage = fieldMessage(validations, databaseConfig, 'key');

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{t('common.label.general')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={3}>
          <BasicField label={t('common.label.key')} message={keyMessage}>
            <BasicInput value={databaseConfig.key} disabled />
          </BasicField>
          <BasicField label={t('common.label.name')}>
            <BasicInput
              value={databaseConfig.name}
              onChange={event => updateDatabaseConfig(database => (database.name = event.target.value))}
            />
          </BasicField>
          <BasicField label={t('common.label.icon')}>
            <Flex alignItems='center' gap={2} className='w-full'>
              <div
                className='flex shrink-0 items-center justify-center rounded-sm border border-border-basic'
                style={{ width: '2.3125rem', height: '2.3125rem' }}
              >
                {databaseConfig.icon && (
                  <img
                    src={iconOptions.find(option => option.value === databaseConfig.icon)?.icon}
                    style={{ width: '1.5rem', height: '1.5rem' }}
                  />
                )}
              </div>
              <div className='flex-1'>
                <Combobox
                  itemRender={item => (
                    <Flex alignItems='center' gap={1}>
                      <img src={item.icon} className='size-3' />
                      <span>{item.label}</span>
                    </Flex>
                  )}
                  onChange={value => updateDatabaseConfig(database => (database.icon = value))}
                  options={iconOptions}
                  value={databaseConfig.icon}
                />
              </div>
            </Flex>
          </BasicField>
          <BasicField label={t('common.label.database')}>
            <BasicSelect
              items={databaseProductItems}
              value={selectedDriver.databaseProduct}
              onValueChange={product =>
                updateDatabaseConfig(database => (database.driver = driversForDatabaseProduct(product).at(0)?.name ?? ''))
              }
            />
          </BasicField>
          <BasicField label={t('common.label.driver')}>
            <BasicSelect
              items={driverItems}
              value={selectedDriver.name}
              onValueChange={driver => updateDatabaseConfig(database => (database.driver = driver))}
            />
          </BasicField>
          <BasicField label={t('database.maxConnections')}>
            <BasicInput
              type='number'
              value={databaseConfig.maxConnections}
              onChange={event => updateDatabaseConfig(database => (database.maxConnections = Number(event.target.value)))}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
