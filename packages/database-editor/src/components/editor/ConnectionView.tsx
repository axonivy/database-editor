import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Flex,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@axonivy/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectionListField } from '../ImportWizard/components/SelectionList';
import { useDatabaseMutation } from './useDatabaseMutation';

export const ConnectionView = ({ context }: { context: DatabaseEditorContext }) => {
  const { jdbcDrivers, activeDb, setActiveDb, UNDEFINED_DB, saveFunction, databaseQuery, databaseTest } = useDatabaseMutation(context);
  const [newDbName, setNewDbName] = useState('');
  const [addDialogState, setAddDialogState] = useState(false);
  const { t } = useTranslation();

  const updateDb = (value: string, key: string, save: boolean = false) =>
    setActiveDb(prev => {
      const prevDb = prev ?? { name: activeDb?.name ?? '', connectionProperties: {} };
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

  const generateDetail = () => {
    const keys = Object.keys(
      jdbcDrivers?.filter(d => d.name === activeDb?.connectionProperties['Driver Class'])[0]?.connectionProperties ?? {}
    );

    return (
      <>
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
        <Flex direction='row' justifyContent='flex-end'>
          <Button variant='primary' onClick={() => databaseTest.refetch()}>
            {'Connection status: ' + databaseTest.data}
          </Button>
        </Flex>
      </>
    );
  };

  const addDialog = (
    <Dialog open={addDialogState} onOpenChange={setAddDialogState}>
      <DialogTrigger asChild>
        <Button variant='primary'>Add Connection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Connection</DialogTitle>
        <Flex direction='column'>
          <BasicField label='Connection Name'>
            <Input value={newDbName} onChange={event => setNewDbName(event.target.value)}></Input>
          </BasicField>
          <Button
            onClick={() => {
              saveFunction.mutate({ name: newDbName, connectionProperties: { ['Driver Class']: jdbcDrivers?.at(0) ?? '' } });
              setNewDbName('');
              setAddDialogState(false);
            }}
          >
            Create
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  );

  return (
    <Flex direction='row' gap={4} style={{ padding: '50px', height: '90%' }}>
      <SelectionListField
        selectionTitle={t('database.databases')}
        items={databaseQuery.data?.map(d => d.name) ?? []}
        onClick={value => {
          const db = databaseQuery.data?.filter(d => d.name === value)[0];
          setActiveDb(db);
        }}
        control={addDialog}
      />
      <BasicField label={t('database.properties')} style={{ width: '150%' }}>
        <Flex className='selection-list-container' direction='column' gap={2}>
          {activeDb && generateDetail()}
        </Flex>
      </BasicField>
    </Flex>
  );
};
