import type { DatabaseConnectionData } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  Button,
  Flex,
  SelectRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { ImportWizard } from '../../ImportWizard/ImportWizard';
import { useDatabaseMutation } from '../useDatabaseMutation';
import './DatabaseMasterContent.css';
import { DbConnectionAddDialog } from './DbConnectionAddDialog';

export const DatabaseMasterContent = ({
  setDetail
}: {
  activeConnection?: DatabaseConnectionData;
  setDetail: (state: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setActiveDb } = useAppContext();
  const { databaseQuery } = useDatabaseMutation();

  const columns: Array<ColumnDef<DatabaseConnectionData, string>> = [
    {
      accessorKey: 'name',
      header: () => <span>{t('common.label.name')}</span>,
      cell: cell => <span>{cell.getValue()}</span>
    },
    {
      accessorKey: 'name',
      header: () => <span>{t('database.host')}</span>,
      cell: cell => <span>{cell.row.original.connectionProperties['Host'] as string}</span>
    },
    {
      accessorKey: 'name',
      header: () => <span>{t('database.port')}</span>,
      cell: cell => <span>{cell.row.original.connectionProperties['Port'] as string}</span>
    }
  ];

  const selection = useTableSelect<DatabaseConnectionData>();

  const table = useReactTable({
    ...selection.options,
    data: databaseQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState
    }
  });

  return (
    <Flex direction='row' gap={4} className='database-master-content'>
      <BasicField style={{ width: '100%', height: '100%' }} label={t('database.allConnections')} control={<DbConnectionControls />}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} onClick={() => selection.options.onRowSelectionChange({})}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <SelectRow
                key={row.id}
                row={row}
                onClick={() => {
                  setActiveDb(row.original);
                  setDetail(true);
                }}
              >
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
  const { context, projects, setActiveDb } = useAppContext();
  const { deleteFunction } = useDatabaseMutation();
  const [addDialog, setAddDialog] = useState(false);
  const { t } = useTranslation();
  return (
    <Flex direction='row' gap={2}>
      <DbConnectionAddDialog open={addDialog} setOpen={setAddDialog} />
      <Button
        icon={IvyIcons.Trash}
        onClick={() => {
          deleteFunction.mutate();
          setActiveDb(undefined);
        }}
      ></Button>
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
