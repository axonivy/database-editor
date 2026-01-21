import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  deleteFirstSelectedRow,
  Flex,
  SelectRow,
  SortableHeader,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader,
  useHotkeys,
  useReadonly,
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useKnownHotkeys } from '../../../util/hotkeys';
import './DatabaseMasterContent.css';
import { EmptyMasterControl, MasterControl } from './MasterControl';

export const DatabaseMasterContent = ({ detail, setDetail }: { detail: boolean; setDetail: (state: boolean) => void }) => {
  const { t } = useTranslation();
  const { databaseConfigs, setSelectedDatabase, setData } = useAppContext();

  const readonly = useReadonly();

  const selection = useTableSelect<DatabaseConfigurationData>({
    onSelect: selectedRows => {
      const selectedRowId = Object.keys(selectedRows).find(key => selectedRows[key]);
      if (selectedRowId === undefined) {
        setSelectedDatabase(undefined);
        return;
      }
      const selectedDatabase = table.getRowModel().flatRows.find(row => row.id === selectedRowId)?.index;
      if (selectedDatabase !== undefined) {
        setSelectedDatabase(selectedDatabase);
      }
    }
  });
  const sort = useTableSort();

  const columns = useMemo<Array<ColumnDef<DatabaseConfigurationData, string>>>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => <span>{cell.getValue()}</span>,
        minSize: 50
      },
      {
        id: 'url',
        accessorFn: data => getUrl(data),
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.url')} />,
        cell: cell => <span>{cell.getValue()}</span>
      },
      {
        accessorKey: 'driver',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.driver')} />,
        cell: cell => <span>{cell.getValue()}</span>
      }
    ],
    [t]
  );

  const table = useReactTable({
    ...selection.options,
    ...sort.options,
    data: databaseConfigs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...sort.tableState
    }
  });

  const { handleKeyDown } = useTableKeyHandler({ table, data: databaseConfigs });

  const hotkeys = useKnownHotkeys();

  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  const deleteDatabaseConnection = () => {
    setData(prev => {
      const { newData } = deleteFirstSelectedRow(table, prev.connections);
      return { connections: newData };
    });
  };
  const ref = useHotkeys<HTMLDivElement>(hotkeys.deleteDatabaseConnection.hotkey, () => deleteDatabaseConnection(), {
    scopes: ['global'],
    enabled: !readonly
  });

  if (databaseConfigs.length === 0) {
    return <EmptyMasterControl table={table} />;
  }

  return (
    <Flex direction='column' onClick={() => table.resetRowSelection()} className='database-editor-master-content' ref={ref}>
      <BasicField
        label={t('database.allConnections')}
        control={!readonly && <MasterControl table={table} deleteDatabaseConnection={deleteDatabaseConnection} />}
        onClick={event => event.stopPropagation()}
        className='database-editor-table-field'
        tabIndex={-1}
        ref={firstElement}
      >
        <Table onKeyDown={event => handleKeyDown(event, () => setDetail(!detail))}>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.resetRowSelection()} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <SelectRow key={row.id} row={row}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </SelectRow>
            ))}
          </TableBody>
        </Table>
      </BasicField>
    </Flex>
  );
};

export const getUrl = (data: DatabaseConfigurationData) => {
  const properties = data.properties;
  const host = properties['ch.ivyteam.jdbc.Host'];
  const port = properties['ch.ivyteam.jdbc.Port'];
  if (!host) {
    return '';
  }
  return `${host}${port ? ':' + port : ''}`;
};
