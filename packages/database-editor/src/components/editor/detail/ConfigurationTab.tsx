import type { DatabaseConnectionData, JdbcDriverProperties } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useDatabaseMutation } from '../useDatabaseMutation';

export const ConfigurationTab = () => {
  const { t } = useTranslation();
  const { setActiveDb, activeDb } = useAppContext();
  const { jdbcDrivers, saveFunction, deleteFunction, UNDEFINED_DB } = useDatabaseMutation();
  const jdbcDriver = jdbcDrivers?.filter(d => d.name === activeDb?.connectionProperties['Driver Class'])[0];
  const jdbcProps = Object.keys(jdbcDriver?.properties ?? {});

  const updateDb = (value: string, key: string) =>
    setActiveDb(prev => {
      const db = prev ?? UNDEFINED_DB;
      const update: DatabaseConnectionData = {
        name: db.name,
        maxConnections: db.maxConnections,
        connectionProperties: {
          ...(db.connectionProperties ?? {})
        }
      };
      if (key === 'maxConnections') {
        update.maxConnections = Number(value);
      } else {
        update.connectionProperties[key] = value;
      }
      saveFunction.mutate(update);
      return update;
    });

  return activeDb ? (
    <>
      <GeneralCollapsible updateDb={updateDb} jdbcDrivers={jdbcDrivers ?? []} />
      <PropertiesCollapsible
        jdbcDriver={jdbcDriver ?? { name: 'unknown driver', properties: {} }}
        jdbcProps={jdbcProps}
        updateDb={updateDb}
      />
      <Flex justifyContent='flex-end'>
        <Button
          variant='primary'
          onClick={() => {
            setActiveDb(undefined);
            deleteFunction.mutate();
          }}
        >
          {t('common.label.delete')}
        </Button>
      </Flex>
    </>
  ) : (
    <span>{t('database.selectDatabase')}</span>
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
            <Select
              onValueChange={value => updateDb(value, 'Driver Class')}
              value={activeDb?.connectionProperties['Driver Class'] as string}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('database.selectDriver')} />
              </SelectTrigger>
              <SelectContent>
                {jdbcDrivers?.map((driver, i) => (
                  <SelectItem key={i} value={driver.name}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </BasicField>
          <BasicField label={t('database.maxConnections')}>
            <Input
              type='number'
              value={activeDb?.maxConnections ?? 0}
              onChange={value => updateDb(value.target.value, 'maxConnections')}
            ></Input>
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
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{t('common.label.properties')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          {jdbcProps.map(k => (
            <BasicField key={k} label={k}>
              <Input
                type={jdbcDriver?.properties[k] == 'number' ? 'number' : 'text'}
                onChange={event => updateDb(event.target.value, k)}
                value={(activeDb?.connectionProperties[k] as string) ?? ''}
              ></Input>
            </BasicField>
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
