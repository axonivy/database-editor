import type { JdbcDriverProperties } from '@axonivy/database-editor-protocol';
import { BasicField, BasicInput, BasicSelect, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';

export const GeneralCollapsible = ({
  updateDb,
  jdbcDrivers
}: {
  updateDb: (key: string, value: string) => void;
  jdbcDrivers: Array<JdbcDriverProperties>;
}) => {
  const { t } = useTranslation();
  const { activeDb } = useAppContext();
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
              value={activeDb?.driver}
              onValueChange={value => updateDb('driver', value)}
            />
          </BasicField>
          <BasicField label={t('database.maxConnections')}>
            <BasicInput
              type='number'
              value={activeDb?.maxConnections ?? 0}
              onChange={value => updateDb('maxConnections', value.target.value)}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
