import type { DatabaseConfigurationData, DatabaseConfigurations } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  Button,
  Flex,
  SelectRow,
  Separator,
  SortableHeader,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useReadonly,
  useTableKeyHandler,
  useTableSort
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { ImportWizard } from '../../ImportWizard/ImportWizard';
import './DatabaseMasterContent.css';
import { DbConnectionAddDialog } from './DbConnectionAddDialog';

export const DatabaseMasterContent = ({ detail, setDetail }: { detail: boolean; setDetail: (state: boolean) => void }) => {
  const { t } = useTranslation();
  const { data } = useAppContext();

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
        accessorKey: 'driver',
        header: ({ column }) => <SortableHeader column={column} name={t('database.jdbcDriver')} />,
        cell: cell => <span>{cell.getValue()}</span>
      }
    ],
    [t]
  );

  const databaseConfigs = data?.connections ?? [];
  const table = useReactTable({
    ...sort.options,
    data: databaseConfigs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...sort.tableState
    }
  });

  const { handleKeyDown } = useTableKeyHandler({ table, data: databaseConfigs });

  const readonly = useReadonly();

  return (
    <Flex direction='column' onClick={() => table.resetRowSelection()} className='database-editor-master-content'>
      <BasicField
        label={t('database.allConnections')}
        control={!readonly && <DbConnectionControls />}
        onClick={event => event.stopPropagation()}
        className='database-editor-table-field'
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

const DbConnectionControls = () => {
  const { context, projects, setActiveDb, activeDb, setData, data } = useAppContext();
  const [addDialog, setAddDialog] = useState(false);
  const { t } = useTranslation();
  return (
    <Flex direction='row' gap={2} className='database-editor-main-control'>
      <DbConnectionAddDialog open={addDialog} setOpen={setAddDialog} />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <Button
        icon={IvyIcons.Trash}
        onClick={() => {
          if (!data) return;
          const update: DatabaseConfigurations = { ...data };
          update.connections = update.connections.filter(c => c.name !== activeDb?.name);
          setData(update);
          setActiveDb(undefined);
        }}
      />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <TooltipProvider>
        <Tooltip>
          <TooltipContent>{t('import.generateTooltip')}</TooltipContent>
          <ImportWizard context={{ file: context.file, app: context.app, projects }}>
            <TooltipTrigger asChild>
              <Button aria-label={t('import.generate')} icon={IvyIcons.SettingsCog} />
            </TooltipTrigger>
          </ImportWizard>
        </Tooltip>
      </TooltipProvider>
    </Flex>
  );
};
