import type { ExecuteSqlResponse, MapStringString } from '@axonivy/database-editor-protocol';
import { Flex, Table, TableBody, TableCell, TableResizableHeader, TableRow } from '@axonivy/ui-components';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

export const SqlResultTable = ({ result }: { result: ExecuteSqlResponse }) => {
  const columns = useMemo<Array<ColumnDef<MapStringString, string>>>(
    () =>
      result.columns.map(col => ({
        accessorKey: col,
        header: () => <span>{col}</span>,
        cell: cell => <span>{cell.getValue()}</span>
      })),
    [result.columns]
  );

  const table = useReactTable({
    data: result.rows,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Flex style={{ overflow: 'auto', flex: 1 }}>
      <Table>
        <TableResizableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Flex>
  );
};
