import type { DatabaseConnectionData } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  Flex,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SidebarHeader
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useDatabaseMutation } from '../useDatabaseMutation';

export const DatabaseDetail = () => {
  const { context, setActiveDb, activeDb } = useAppContext();
  const { jdbcDrivers, UNDEFINED_DB, saveFunction } = useDatabaseMutation(context);

  const keys = Object.keys(
    jdbcDrivers?.filter(d => d.name === activeDb?.connectionProperties['Driver Class'])[0]?.connectionProperties ?? {}
  );

  const updateDb = (value: string, key: string, save: boolean = false) =>
    setActiveDb((pref: DatabaseConnectionData | undefined) => {
      const prevDb = pref ?? { name: activeDb?.name ?? '', connectionProperties: {} };
      const update = {
        ...prevDb,
        connectionProperties: {
          ...(prevDb.connectionProperties ?? {}),
          [key]: value
        }
      };
      if (save) {
        saveFunction.mutate(update);
      }
      return update;
    });

  const { t } = useTranslation();
  return (
    <Flex direction='column'>
      <SidebarHeader title={t('database.connenctionProperties')} icon={IvyIcons.PenEdit} />
      <BasicField label={t('database.jdbcDriver')}>
        <Select
          onValueChange={value => updateDb(value, 'Driver Class', true)}
          value={activeDb?.connectionProperties['Driver Class'] as string}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a driver' />
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
      {keys.map(k => (
        <BasicField key={k} label={k}>
          <Input
            onChange={event => updateDb(event.target.value, k)}
            onBlur={() => saveFunction.mutate(activeDb ?? UNDEFINED_DB)}
            value={(activeDb?.connectionProperties[k] as string) ?? ''}
          ></Input>
        </BasicField>
      ))}
    </Flex>
  );
};
