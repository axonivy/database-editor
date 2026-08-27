import type { ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { dataTableHelper, Flex, Table, TableBody, TableCell, TableResizableHeader, TableRow } from '@axonivy/ui-components';
import { flexRender, useTable } from '@tanstack/react-table';
import { useCallback, useMemo, useRef } from 'react';

const { columnHelper, tableOptions } = dataTableHelper<string[]>();

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
  const BOTTOM_THRESHOLD_PX = 80;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(
    () =>
      columnHelper.columns(
        result.columns.map((col, index) =>
          columnHelper.accessor(row => row[index] ?? '', {
            id: `${index}`,
            header: () => <span title={col.type}>{col.name}</span>,
            cell: cell => cell.getValue()
          })
        )
      ),
    [result.columns]
  );

  const table = useTable({
    ...tableOptions,
    data: result.rows,
    columns
  });

  const tryLoadMoreRows = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingNextPage || !canLoadMore) {
      return;
    }

    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceToBottom <= BOTTOM_THRESHOLD_PX) {
      loadMoreRows();
    }
  }, [canLoadMore, isLoadingNextPage, loadMoreRows]);

  return (
    <Flex className='min-h-0 flex-1'>
      <div ref={scrollContainerRef} className='max-h-[50vh] w-full overflow-auto' onScroll={tryLoadMoreRows}>
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
      </div>
    </Flex>
  );
};
