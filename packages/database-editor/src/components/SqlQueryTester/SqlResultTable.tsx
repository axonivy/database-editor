import type { ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { Flex, Table, TableBody, TableCell, TableResizableHeader, TableRow } from '@axonivy/ui-components';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

export const SqlResultTable = ({ result }: { result: ExecuteSqlResponse }) => {
  const columns = useMemo<Array<ColumnDef<string[], string>>>(
    () =>
      result.columns.map((col, index) => ({
        id: `${index}`,
        accessorFn: row => row[index] ?? '',
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
    <Flex className='flex-1 overflow-auto'>
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
