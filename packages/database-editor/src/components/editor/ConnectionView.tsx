import type { DatabaseConnectionData, DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { BasicField, Button, Flex, Input } from '@axonivy/ui-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useClient } from '../../protocol/ClientContextProvider';
import { useMeta } from '../../protocol/use-meta';
import { genQueryKey } from '../../query/query-client';
import { SelectionListField } from '../ImportWizard/components/SelectionList';

export const ConnectionView = ({ context }: { context: DatabaseEditorContext }) => {
  const client = useClient();

  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined);
  const [activeDb, setActiveDb] = useState<DatabaseConnectionData>();
  const [activeJdbc, setActiveJdbc] = useState<DatabaseConnectionData | undefined>();

  const databaseQuery = useQuery({
    queryKey: useMemo(() => genQueryKey('databaseConnections', context), [context]),
    queryFn: async () => {
      return await client.databaseConnections(context);
    },
    structuralSharing: false
  });

  const saveFunction = useMutation({
    mutationKey: genQueryKey('saveDatabaseConnection', {
      context: context,
      data: activeDb
    }),
    mutationFn: (dbData: DatabaseConnectionData) =>
      client.saveDatabaseConnection({
        context: context,
        data: dbData
      }),
    onSuccess: databaseQuery.refetch
  });

  const generateDetail = () => {
    const keys = Object.keys(activeJdbc?.connectionProperties ?? {});
    return keys.map(k => (
      <BasicField key={k} label={k}>
        <Input
          onChange={value =>
            setActiveDb(prev => {
              const update: DatabaseConnectionData = {
                name: prev?.name ?? '',
                connectionProperties: { k: value, ...prev?.connectionProperties }
              };
              saveFunction.mutate(update);
              return update;
            })
          }
          value={(activeDb?.connectionProperties[k] as string) ?? ''}
        ></Input>
      </BasicField>
    ));
  };

  return (
    <Flex direction='row' gap={4} style={{ padding: '50px', height: '90%' }}>
      <SelectionListField
        selectionTitle='Databases'
        items={databaseQuery.data?.map(d => d.name) ?? []}
        onClick={value => {
          const db = databaseQuery.data?.filter(d => d.name === value)[0];
          setActiveDb(db);
          setActiveJdbc(jdbcDrivers.data?.filter(d => d.name === db?.connectionProperties['JdbcDriver'])[0]);
        }}
        control={<Button></Button>}
      />
      <BasicField label='Properties' style={{ width: '150%' }}>
        <Flex direction='column'>{activeJdbc && generateDetail()}</Flex>
      </BasicField>
    </Flex>
  );
};
