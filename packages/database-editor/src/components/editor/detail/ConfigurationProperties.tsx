import type { JdbcDriverProperties } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  BasicInput,
  BasicSelect,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Message
} from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import './ConfigurationProperties.css';

export const ConfigurationProperties = () => {
  const { t } = useTranslation();
  const { jdbcDrivers, activeDb } = useAppContext();
  const jdbcDriver = jdbcDrivers?.filter(d => d.name === activeDb?.driver)[0];
  const jdbcProps = Object.keys(jdbcDriver?.properties ?? {});

  return (
    <Flex direction='column' gap={3} className='configuration-options'>
      {activeDb ? (
        <>
          <GeneralCollapsible updateDb={() => {}} jdbcDrivers={jdbcDrivers ?? []} />
          <PropertiesCollapsible
            jdbcDriver={jdbcDriver ?? { name: 'unknown driver', properties: {} }}
            jdbcProps={jdbcProps}
            updateDb={() => {}}
          />
        </>
      ) : (
        <Message variant='info'>{t('database.selectDatabase')}</Message>
      )}
    </Flex>
  );
};

const GeneralCollapsible = ({
  updateDb,
  jdbcDrivers
}: {
  updateDb: (value: string, key: string) => void;
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
              onValueChange={value => updateDb(value, 'Driver Class')}
            />
          </BasicField>
          <BasicField label={t('database.maxConnections')}>
            <BasicInput
              type='number'
              value={activeDb?.maxConnections ?? 0}
              onChange={value => updateDb(value.target.value, 'maxConnections')}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};

const PropertiesCollapsible = ({
  jdbcProps,
  jdbcDriver,
  updateDb
}: {
  jdbcProps: Array<string>;
  jdbcDriver: JdbcDriverProperties;
  updateDb: (value: string, key: string) => void;
}) => {
  const { activeDb } = useAppContext();
  const { t } = useTranslation();
  console.log(activeDb);
  console.log(jdbcDriver);
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{t('common.label.properties')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          {jdbcProps.map(k => (
            <BasicField key={k} label={k}>
              <BasicInput
                type={jdbcDriver?.properties[k] == 'number' ? 'number' : 'text'}
                onChange={event => updateDb(event.target.value, k)}
                value={(activeDb?.properties.find(p => p.name === k)?.value as string) ?? ''}
              />
            </BasicField>
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
