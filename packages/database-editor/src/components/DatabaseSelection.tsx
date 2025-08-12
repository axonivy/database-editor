import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useClient } from '../protocol/ClientContextProvider';
import { genQueryKey } from '../query/query-client';

export const DatabaseSelection = ({
  context,
  updateSelection
}: {
  context: DatabaseEditorContext;
  updateSelection: (database: string) => void;
}) => {
  const client = useClient();

  const databaseQueryKey = useMemo(() => genQueryKey('data', context), [context]);

  const databaseQuery = useQuery({
    queryKey: databaseQueryKey,
    queryFn: async () => {
      const content = await client.data(context);
      return { ...content };
    },
    structuralSharing: false
  });

  return (
    <Select onValueChange={updateSelection}>
      <SelectTrigger>
        <SelectValue placeholder='Select a database' />
        <SelectContent>
          <SelectGroup>
            <SelectLabel>System</SelectLabel>
            <SelectItem value='IvySystemDatabase'>IvySystemDatabase</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>databases.yaml</SelectLabel>
            {databaseQuery.data?.databaseNames.map(database => (
              <SelectItem key={database.toString()} value={database.toString()}>
                {database}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
};
