import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  deleteFirstSelectedRow,
  Flex,
  IvyIcon,
  SortableHeader,
  Table,
  TableBody,
  TableResizableHeader,
  useHotkeys,
  useReadonly,
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useMeta } from '../../../protocol/use-meta';
import { useKnownHotkeys } from '../../../util/hotkeys';
import { ConnectionStateIndicator } from './ConnectionStateIndicator';
import { EmptyMasterControl, MasterControl } from './MasterControl';
import { ValidationRow } from './ValidationRow';

export const DatabaseMasterContent = ({ detail, setDetail }: { detail: boolean; setDetail: (state: boolean) => void }) => {
  const { t } = useTranslation();
  const hotkeys = useKnownHotkeys();
  const readonly = useReadonly();
  const sort = useTableSort();
  const { context } = useAppContext();
  const iconMeta = useMeta('meta/icons/all', context);
  const { databaseConfigs, setSelectedDatabase, setData, connectionTestResult, selectedDatabase } = useAppContext();

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

  const columns = useMemo<Array<ColumnDef<DatabaseConfigurationData, string>>>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => {
          const iconPath = iconMeta.data?.find(icon => icon.relativePath === cell.row.original.icon)?.path;
          return (
            <Flex alignItems='center' gap={1}>
              {iconPath ? <img src={iconPath} alt='icon' className='size-3' /> : <IvyIcon icon={IvyIcons.Database} />}
              <span>{cell.getValue()}</span>
            </Flex>
          );
        },
        minSize: 50
      },
      {
        id: 'url',
        accessorFn: urlOfConnection,
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.url')} />,
        cell: cell => <span>{cell.getValue()}</span>
      },
      {
        id: 'driver',
        accessorFn: driverOfConnection,
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.driver')} />,
        cell: cell => <span>{cell.getValue()}</span>
      },
      {
        accessorKey: 'name',
        id: 'state',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.state')} />,
        cell: cell => {
          const data = connectionTestResult[cell.getValue()] ?? { state: 'UNKNOWN', advise: '', exception: '' };
          return (
            <Flex justifyContent='center'>
              <ConnectionStateIndicator {...data} />
            </Flex>
          );
        },
        size: 40
      }
    ],
    [connectionTestResult, t, iconMeta.data]
  );

  const table = useReactTable({
    ...selection.options,
    ...sort.options,
    data: databaseConfigs,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...sort.tableState
    }
  });

  const { handleKeyDown } = useTableKeyHandler({ table, data: databaseConfigs });

  const firstElementRef = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElementRef.current?.focus(), { scopes: ['global'] });

  const deleteDatabaseConnection = () => {
    setData(prev => {
      const { newData } = deleteFirstSelectedRow(table, prev.connections);
      return { connections: newData, helpUrl: '' };
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
    <Flex direction='column' onClick={() => table.resetRowSelection()} className='h-full overflow-auto' ref={ref}>
      <BasicField
        label={t('database.allConnections')}
        control={
          !readonly && (
            <MasterControl table={table} deleteDatabaseConnection={deleteDatabaseConnection} selectedDatabase={selectedDatabase} />
          )
        }
        onClick={event => event.stopPropagation()}
        className='m-3 min-h-0'
        tabIndex={-1}
        ref={firstElementRef}
      >
        <Table onKeyDown={event => handleKeyDown(event, () => setDetail(!detail))}>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.resetRowSelection()} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow key={row.id} row={row} validationPath={row.original.key} />
            ))}
          </TableBody>
        </Table>
      </BasicField>
    </Flex>
  );
};

export const urlOfConnection = (data: DatabaseConfigurationData) => {
  const host = data.properties['ch.ivyteam.jdbc.Host'];
  if (host) {
    const port = data.properties['ch.ivyteam.jdbc.Port'];
    if (port) {
      return `${host}:${port}`;
    }
    return host;
  }
  return data.properties['ch.ivyteam.jdbc.ConnectionUrl'];
};

export const driverOfConnection = (data: DatabaseConfigurationData) => {
  return data.driver || data.properties['ch.ivyteam.jdbc.DriverName'];
};
