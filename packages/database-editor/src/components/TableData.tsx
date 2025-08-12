import type { DatabaseColumn, DatabaseInfoData } from '@axonivy/database-editor-protocol';
import { Table, TableCell, TableHeader, TableRow } from '@axonivy/ui-components';

export const TableData = ({ data }: { data: DatabaseInfoData }) => {
  const name = data.connectionName;
  const tables = data.tables;
  return (
    <Table>
      <TableHeader>{name}</TableHeader>
      {tables.map(table => (
        <TableRow key={table.name}>
          <TableCell>{table.name}</TableCell>
          <TableCell>{generateColumns(table.columns)}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
};

export const generateColumns = (columns: Array<DatabaseColumn>) => columns.map(column => column.name).join(', ');
