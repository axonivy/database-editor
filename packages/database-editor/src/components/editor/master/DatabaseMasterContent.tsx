import type { DatabaseConnectionData, DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { BasicField, SelectRow, Table, TableBody, TableHeader } from '@axonivy/ui-components';
import { useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useDatabaseMutation } from '../useDatabaseMutation';

export const DatabaseMasterContext = ({
  activeConnection,
  setActiveConnection,
  context
}: {
  activeConnection?: DatabaseConnectionData;
  setActiveConnection: (con: DatabaseConnectionData) => void;
  context: DatabaseEditorContext;
}) => {
  const { t } = useTranslation();
  const { databaseQuery } = useDatabaseMutation(context);

  const table = useReactTable;

  return (
    <BasicField label={t('database.databaseConnections')}>
      <Table>
        <TableHeader />
        <TableBody>
          {databaseQuery.data?.map(connection => (
            <SelectRow
              row={{
                id: connection.name
              }}
              key={connection.name}
            >
              {connection.name}
            </SelectRow>
          ))}
        </TableBody>
      </Table>
    </BasicField>
  );
};
