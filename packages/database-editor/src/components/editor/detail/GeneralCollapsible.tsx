import type { DatabaseConfigurationData, JdbcDriverProperties } from '@axonivy/database-editor-protocol';
import { BasicField, BasicInput, BasicSelect, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

type GeneralCollapsibleProps = {
  activeDb: DatabaseConfigurationData;
  jdbcDrivers: Array<JdbcDriverProperties>;
  updateDb: (propertyUpdater: (database: DatabaseConfigurationData) => void) => void;
};

export const GeneralCollapsible = ({ activeDb, jdbcDrivers, updateDb }: GeneralCollapsibleProps) => {
  const { t } = useTranslation();
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{t('common.label.general')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label={t('database.jdbcDriver')}>
            <BasicSelect
              items={jdbcDrivers.map(d => ({
                value: d.name,
                label: d.name
              }))}
              value={activeDb.driver}
              onValueChange={value => updateDb(database => (database.driver = value))}
            />
          </BasicField>
          <BasicField label={t('database.maxConnections')}>
            <BasicInput
              type='number'
              value={activeDb.maxConnections}
              onChange={event => updateDb(database => (database.maxConnections = Number(event.target.value)))}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
