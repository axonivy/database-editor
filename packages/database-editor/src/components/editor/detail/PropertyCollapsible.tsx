import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDetailContext } from '../../../AppContext';

export const PropertyCollapsible = () => {
  const { t } = useTranslation();
  const { databaseConfig, updateDatabaseConfig, selectedDriver } = useDetailContext();

  const propertyTranslation: Record<string, string> = useMemo(
    () => ({
      'ch.ivyteam.jdbc.UserName': t('database.property.userName'),
      'ch.ivyteam.jdbc.DbName': t('database.property.databaseName'),
      'ch.ivyteam.jdbc.Port': t('database.property.port'),
      'ch.ivyteam.jdbc.Host': t('database.property.host'),
      'ch.ivyteam.jdbc.Password': t('database.property.password'),
      'ch.ivyteam.jdbc.ODBC': t('database.property.odbc'),
      'ch.ivyteam.jdbc.FileName': t('database.property.fileName'),
      'ch.ivyteam.jdbc.SchemaName': t('database.property.schemaName'),
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

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{t('common.label.properties')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          {Object.entries(selectedDriver.properties).map(([key, value]) => (
            <BasicField key={key} label={getLabel(key)}>
              <BasicInput
                type={value === 'number' ? 'number' : 'text'}
                onChange={event => updateDatabaseConfig(database => (database.properties[key] = event.target.value))}
                value={databaseConfig.properties[key] ?? ''}
              />
            </BasicField>
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
