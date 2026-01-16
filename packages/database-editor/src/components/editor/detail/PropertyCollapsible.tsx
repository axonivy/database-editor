import type { DatabaseConfigurationData, JdbcDriverProperties, MapStringString } from '@axonivy/database-editor-protocol';
import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

type PropertyCollapsibleProps = {
  activeDb: DatabaseConfigurationData;
  jdbcProps: Array<string>;
  jdbcDriver: JdbcDriverProperties;
  updateDb: (propertyUpdater: (database: DatabaseConfigurationData) => void) => void;
};

export const PropertyCollapsible = ({ activeDb, jdbcProps, jdbcDriver, updateDb }: PropertyCollapsibleProps) => {
  const { t } = useTranslation();

  const propertyTranslation: MapStringString = {
    'ch.ivyteam.jdbc.UserName': t('database.property.userName'),
    'ch.ivyteam.jdbc.DatabaseName': t('database.property.databaseName'),
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
  };

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
          {jdbcProps.map(k => (
            <BasicField key={k} label={getLabel(k)}>
              <BasicInput
                type={jdbcDriver.properties[k] === 'number' ? 'number' : 'text'}
                onChange={event =>
                  updateDb(database => {
                    database.properties[k] = event.target.value;
                  })
                }
                value={activeDb.properties[k]}
              />
            </BasicField>
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
