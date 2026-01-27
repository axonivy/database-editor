import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  Button,
  deleteFirstSelectedRow,
  ExpandableCell,
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
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable, type ColumnDef, type ExpandedState } from '@tanstack/react-table';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useKnownHotkeys } from '../../../util/hotkeys';
import { ConnectionStateIndicator } from './ConnectionStateIndicator';
import './DatabaseMasterContent.css';
import { EmptyMasterControl, MasterControl } from './MasterControl';

export type PersistenceUnit = {
  name: string;
  dataSource: string;
  description: string;
  managedClasses: Array<string>;
  properties: Map<string, string>;
};

export const persistenceUnits = new Map<string, Array<PersistenceUnit>>([
  ['database0', []],
  [
    'database1',
    [
      {
        name: 'persistenceUnit10',
        dataSource: 'database1',
        description: '',
        managedClasses: ['ch.ivyteam.Entity100', 'ch.ivyteam.Entity101'],
        properties: new Map([
          ['property100', 'value100'],
          ['property101', 'value101']
        ])
      },
      {
        name: 'persistenceUnit11',
        dataSource: 'database1',
        description: '',
        managedClasses: ['ch.ivyteam.Entity110'],
        properties: new Map()
      }
    ]
  ],
  ['database2', [{ name: 'persistenceUnit20', dataSource: 'database2', description: '', managedClasses: [], properties: new Map() }]],
  ['database3', []]
]);

const rowHasPersistenceUnits = (row: DatabaseConfigurationData | PersistenceUnit) => (persistenceUnits.get(row.name)?.length ?? 0) > 0;
const isPersistenceUnitRow = (row: DatabaseConfigurationData | PersistenceUnit) => (row as PersistenceUnit).dataSource !== undefined;

export const DatabaseMasterContent = ({ detail, setDetail }: { detail: boolean; setDetail: (state: boolean) => void }) => {
  const { t } = useTranslation();
  const hotkeys = useKnownHotkeys();
  const readonly = useReadonly();
  const sort = useTableSort();
  const { databaseConfigs, setSelectedDatabase, setData, connectionTestResult, setSelectedPersistenceUnit } = useAppContext();

  const selection = useTableSelect<DatabaseConfigurationData | PersistenceUnit>({
    onSelect: selectedRows => {
      const selectedRowId = Object.keys(selectedRows).find(key => selectedRows[key]);
      if (selectedRowId === undefined) {
        setSelectedDatabase(undefined);
        setSelectedPersistenceUnit(undefined);
        return;
      }
      if (selectedRowId.includes('.')) {
        setSelectedDatabase(undefined);
        setSelectedPersistenceUnit(selectedRowId);
        return;
      }
      const selectedDatabase = Number(selectedRowId);
      if (!Number.isNaN(selectedDatabase)) {
        setSelectedDatabase(selectedDatabase);
      }
    }
  });

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const columns = useMemo<Array<ColumnDef<DatabaseConfigurationData | PersistenceUnit, string>>>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => {
          const row = cell.row;
          const persistenceUnit = isPersistenceUnitRow(row.original);
          const displayName = cell.getValue();
          return (
            <ExpandableCell cell={cell}>
              <span className={persistenceUnit ? 'database-editor-master-sub-label' : undefined}>{displayName}</span>
              {!isPersistenceUnitRow(row.original) && <Button icon={IvyIcons.Plus} aria-label={'Add Persistence Unit'} />}
            </ExpandableCell>
          );
        },
        minSize: 50
      },
      {
        id: 'url',
        accessorFn: urlOfConnection,
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.url')} />,
        cell: cell => {
          if (isPersistenceUnitRow(cell.row.original)) {
            return;
          }
          return <span>{cell.getValue()}</span>;
        }
      },
      {
        id: 'driver',
        accessorFn: driverOfConnection,
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.driver')} />,
        cell: cell => {
          if (isPersistenceUnitRow(cell.row.original)) {
            return;
          }
          return <span>{cell.getValue()}</span>;
        }
      },
      {
        accessorKey: 'name',
        id: 'state',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.state')} />,
        cell: cell => {
          if (isPersistenceUnitRow(cell.row.original)) {
            return;
          }
          const data = connectionTestResult[cell.getValue()] ?? { state: 'UNKNOWN', advise: '', exception: '' };
          return (
            <Flex justifyContent='center'>
              <ConnectionStateIndicator {...data} />
            </Flex>
          );
        },
        maxSize: 20,
        minSize: 20
      }
    ],
    [connectionTestResult, t]
  );

  const table = useReactTable({
    ...selection.options,
    ...sort.options,
    data: databaseConfigs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSubRows: row => persistenceUnits.get(row.name),
    getRowCanExpand: row => row.depth === 0 && rowHasPersistenceUnits(row.original),
    getExpandedRowModel: getExpandedRowModel(),
    enableSubRowSelection: false,
    onExpandedChange: setExpanded,
    state: {
      ...selection.tableState,
      ...sort.tableState,
      expanded
    }
  });

  const { handleKeyDown } = useTableKeyHandler({ table, data: databaseConfigs });

  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  const deleteDatabaseConnection = () => {
    setData(prev => {
      const { newData } = deleteFirstSelectedRow(table, prev.connections);
      return { connections: newData as Array<DatabaseConfigurationData>, helpUrl: '' };
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
