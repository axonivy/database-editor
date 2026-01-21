import { BasicField, BasicInput, BasicSelect, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDetailContext } from '../../../AppContext';

export const GeneralCollapsible = () => {
  const { t } = useTranslation();
  const { databaseConfig, updateDatabaseConfig, drivers, selectedDriver } = useDetailContext();
  const [databaseProduct, setDatabaseProduct] = useState(selectedDriver.databaseProduct);

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
    () => driversForDatabaseProduct(databaseProduct).map(driver => ({ label: driver.name, value: driver.name })),
    [databaseProduct, driversForDatabaseProduct]
  );

  const onDatabaseProductChange = (product: string) => {
    setDatabaseProduct(product);
    updateDatabaseConfig(database => (database.driver = driversForDatabaseProduct(product).at(0)?.name ?? ''));
  };

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{t('common.label.general')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label={t('common.label.database')}>
            <BasicSelect items={databaseProductItems} value={databaseProduct} onValueChange={onDatabaseProductChange} />
          </BasicField>
          <BasicField label={t('common.label.driver')}>
            <BasicSelect
              items={driverItems}
              value={selectedDriver.name}
              onValueChange={value => updateDatabaseConfig(database => (database.driver = value))}
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
