import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useCallback, useMemo, type HTMLInputTypeAttribute } from 'react';
import { useTranslation } from 'react-i18next';
import { useDetailContext } from './DetailContext';

export const PropertyCollapsible = () => {
  const { t } = useTranslation();
  const { databaseConfig, updateDatabaseConfig, selectedDriver } = useDetailContext();

  const propertyTranslation: Record<string, string> = useMemo(
    () => ({
      'ch.ivyteam.jdbc.Host': t('database.property.host'),
      'ch.ivyteam.jdbc.Port': t('database.property.port'),
      'ch.ivyteam.jdbc.DbName': t('database.property.databaseName'),
      'ch.ivyteam.jdbc.DriverName': t('database.property.driverName'),
      'ch.ivyteam.jdbc.ConnectionUrl': t('database.property.connectionUrl'),
      'ch.ivyteam.jdbc.UserName': t('database.property.userName'),
      'ch.ivyteam.jdbc.Password': t('database.property.password'),
      'ch.ivyteam.jdbc.FileName': t('database.property.fileName'),
      'ch.ivyteam.jdbc.OracleTNS': t('database.property.oracleTNS'),
      'ch.ivyteam.jdbc.OracleServiceId': t('database.property.oracleServiceId'),
      'ch.ivyteam.jdbc.OracleServiceName': t('database.property.oracleServiceName'),
      'ch.ivyteam.jdbc.OracleLdap': t('database.property.oracleLdap'),
      'ch.ivyteam.jdbc.OracleLdaps': t('database.property.oracleLdaps')
    }),
    [t]
  );

  const getLabel = (key: string) => {
    if (key in propertyTranslation) {
      return propertyTranslation[key];
    }
    return key;
  };

  const compareByName = useCallback((key1: string, key2: string) => {
    const order = [
      'ch.ivyteam.jdbc.Host',
      'ch.ivyteam.jdbc.Port',
      'ch.ivyteam.jdbc.DbName',
      'ch.ivyteam.jdbc.UserName',
      'ch.ivyteam.jdbc.Password'
    ];
    const i1 = order.indexOf(key1);
    const i2 = order.indexOf(key2);
    return (i1 === -1 ? Number.MAX_SAFE_INTEGER : i1) - (i2 === -1 ? Number.MAX_SAFE_INTEGER : i2);
  }, []);

  const sortedProperties = useMemo(
    () => Object.entries(selectedDriver.properties).sort((e1, e2) => compareByName(e1[0], e2[0])),
    [compareByName, selectedDriver.properties]
  );

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{t('common.label.properties')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          {sortedProperties.map(([key, value]) => {
            const type: HTMLInputTypeAttribute = key === 'ch.ivyteam.jdbc.Password' ? 'password' : value === 'number' ? 'number' : 'text';
            return (
              <BasicField key={key} label={getLabel(key)}>
                <BasicInput
                  type={type}
                  onChange={event => updateDatabaseConfig(database => (database.properties[key] = event.target.value))}
                  value={databaseConfig.properties[key] ?? ''}
                />
              </BasicField>
            );
          })}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
