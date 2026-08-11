import type { ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { Button, Flex, Table, TableBody, TableCell, TableResizableHeader, TableRow } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const SqlResultTable = ({
  result,
  loadMoreRows,
  isLoadingNextPage,
  canLoadMore
}: {
  result: Pick<ExecuteSqlResponse, 'columns' | 'rows'>;
  loadMoreRows: () => Promise<void>;
  isLoadingNextPage: boolean;
  canLoadMore: boolean;
}) => {
  const { t } = useTranslation();

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
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20
      }
    }
  });

  const handleNextPage = async () => {
    if (table.getCanNextPage()) {
      table.nextPage();
      return;
    }

    if (isLoadingNextPage || !canLoadMore) {
      return;
    }

    const nextPageIndex = table.getState().pagination.pageIndex + 1;
    await loadMoreRows();
    table.setPageIndex(nextPageIndex);
  };

  return (
    <Flex className='min-h-0 flex-1'>
      <div className='max-h-[50vh] w-full overflow-auto'>
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
        <div>
          <Flex direction='row' alignItems='center' gap={2} className='border-t border-n200 px-2 py-1'>
            <Button
              icon={IvyIcons.Chevron}
              rotate={180}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            ></Button>
            <Button
              icon={isLoadingNextPage ? IvyIcons.Spinner : IvyIcons.Chevron}
              onClick={handleNextPage}
              disabled={isLoadingNextPage || (!table.getCanNextPage() && !canLoadMore)}
              spin={isLoadingNextPage}
            ></Button>
            <div>{t('dialog.sqlExecutor.page')}</div>
            <strong>
              {(table.getState().pagination.pageIndex + 1).toLocaleString()} {t('dialog.sqlExecutor.of')}{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
            <div>{result.rows.length.toLocaleString()}</div>
          </Flex>
        </div>
      </div>
    </Flex>
  );
};
