import type { DatabaseInfoData } from '@axonivy/database-editor-protocol';
import { Table, TableCell, TableHeader, TableRow } from '@axonivy/ui-components';

export const TableData = ({ data }: { data: DatabaseInfoData }) => {
  const name = data.connectionName;
  const tables = data.tables;
  return (
    <Table>
      <TableHeader>{name}</TableHeader>
      {tables.map(table => (
        <TableRow>
          <TableCell>{table.name}</TableCell>
          <TableCell>{table.columns.map(column => column.name).join(', ')}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
};
