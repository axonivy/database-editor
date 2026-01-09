import type { DatabaseConfig, JdbcDriverProperties } from '@axonivy/database-editor-protocol';
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
  const { jdbcDrivers, databaseConfigs, selectedDatabase } = useAppContext();

  const databaseConfig = selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;
  if (!databaseConfig) {
    return <Message variant='info'>{t('database.selectDatabase')}</Message>;
  }

  const jdbcDriver = jdbcDrivers.find(driver => driver.name === databaseConfig.driver);
  const jdbcProps = Object.keys(jdbcDriver?.properties ?? {});

  return (
    <Flex direction='column' gap={3} className='configuration-options'>
      <GeneralCollapsible databaseConfig={databaseConfig} updateDb={() => {}} jdbcDrivers={jdbcDrivers ?? []} />
      <PropertiesCollapsible
        databaseConfig={databaseConfig}
        jdbcDriver={jdbcDriver ?? { name: 'unknown driver', properties: {} }}
        jdbcProps={jdbcProps}
        updateDb={() => {}}
      />
    </Flex>
  );
};

type GeneralCollapsibleProps = {
  databaseConfig: DatabaseConfig;
  updateDb: (value: string, key: string) => void;
  jdbcDrivers: Array<JdbcDriverProperties>;
};

const GeneralCollapsible = ({ databaseConfig, updateDb, jdbcDrivers }: GeneralCollapsibleProps) => {
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
              value={databaseConfig.driver}
              onValueChange={value => updateDb(value, 'Driver Class')}
            />
          </BasicField>
          <BasicField label={t('database.maxConnections')}>
            <BasicInput
              type='number'
              value={databaseConfig.maxConnections ?? 0}
              onChange={value => updateDb(value.target.value, 'maxConnections')}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};

type PropertiesCollapsibleProps = {
  databaseConfig: DatabaseConfig;
  jdbcProps: Array<string>;
  jdbcDriver: JdbcDriverProperties;
  updateDb: (value: string, key: string) => void;
};

const PropertiesCollapsible = ({ databaseConfig, jdbcProps, jdbcDriver, updateDb }: PropertiesCollapsibleProps) => {
  const { t } = useTranslation();
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{t('common.label.properties')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          {jdbcProps.map(k => (
            <BasicField key={k} label={k}>
              <BasicInput
                type={jdbcDriver.properties[k] == 'number' ? 'number' : 'text'}
                onChange={event => updateDb(event.target.value, k)}
                value={(databaseConfig.properties.find(p => p.name === k)?.value as string) ?? ''}
              />
            </BasicField>
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
