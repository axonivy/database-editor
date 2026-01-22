import {
  addRow,
  BasicField,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  deleteFirstSelectedRow,
  Flex,
  InputCell,
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
import { useTranslation } from 'react-i18next';

import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

type StringObject = { key: string; value: string | undefined };

type AdditionalCollapsibleProps = {
  activeDb: DatabaseConfigurationData;
  updateDb: (propertyUpdater: (database: DatabaseConfigurationData) => void) => void;
};

export const AdditionalCollapsible = ({ activeDb, updateDb }: AdditionalCollapsibleProps) => {
  const props = useMemo(
    () => Object.entries(activeDb.additionalProperties).map(entry => ({ key: entry[0] as string, value: entry[1] as string })),
    [activeDb]
  );

  const { t } = useTranslation();

  const columns: Array<ColumnDef<StringObject, string>> = [
    {
      accessorKey: 'key',
      header: () => <span>{t('common.label.name')}</span>,
      cell: cell => <InputCell cell={cell} aria-placeholder={t('database.placeholder.key')} />
    },
    {
      accessorKey: 'value',
      header: () => <span>{t('common.label.value')}</span>,
      cell: cell => <InputCell cell={cell} aria-placeholder={t('database.placeholder.value')} />
    }
  ];
  const selection = useTableSelect<StringObject>();

  const table = useReactTable({
    ...selection.options,
    data: props,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState
    },
    meta: {
      updateData: (rowId, columnId, value) => {
        const prop: StringObject =
          columnId === 'key' ? { key: value, value: props[Number(rowId)]?.value } : { key: props[Number(rowId)]?.key ?? '', value };
        const oldKey = props[Number(rowId)]?.key ?? '';
        updateProperty(prop.key, prop.value ?? '', oldKey);
      }
    }
  });

  const updateProperty = (key: string, value: string, oldKey: string) => {
    const newProps = structuredClone(props);
    const updateProp = newProps.find(prop => prop.key === oldKey);
    if (!updateProp) return;

    updateProp.key = key;
    updateProp.value = value;
    updateDb(database => (database.additionalProperties = toProperties(newProps)));
  };

  const addPropertyRow = () =>
    updateDb(database => {
      const newData = addRow(table, props, { key: t('database.placeholder.key'), value: t('database.placeholder.value') });
      database.additionalProperties = toProperties(newData);
    });

  const deleteRow = () => {
    updateDb(database => {
      const { newData } = deleteFirstSelectedRow(table, props);
      database.additionalProperties = toProperties(newData);
    });
  };

  return (
    <Collapsible>
      <CollapsibleTrigger>{t('database.additionalProperties')}</CollapsibleTrigger>
      <CollapsibleContent>
        <BasicField
          label={t('database.additionalProperties')}
          control={
            <TableControl addRow={addPropertyRow} deleteRow={deleteRow} hasSelection={table.getSelectedRowModel().flatRows.length !== 0} />
          }
        >
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
                <SelectRow key={row.id} row={row}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </SelectRow>
              ))}
            </TableBody>
          </Table>
        </BasicField>
      </CollapsibleContent>
    </Collapsible>
  );
};

type TableControlProps = {
  addRow: () => void;
  deleteRow: () => void;
  hasSelection: boolean;
};

const TableControl = ({ addRow, deleteRow, hasSelection }: TableControlProps) => {
  const { t } = useTranslation();
  return (
    <Flex direction='row' gap={2}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button icon={IvyIcons.Plus} onClick={addRow} aria-label={t('detail.additionalProperties.addProperty')} />
          </TooltipTrigger>
          <TooltipContent>{t('detail.additionalProperties.addProperty')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              icon={IvyIcons.Trash}
              onClick={deleteRow}
              disabled={!hasSelection}
              aria-label={t('detail.additionalProperties.deleteProperty')}
            />
          </TooltipTrigger>
          <TooltipContent>{t('detail.additionalProperties.deleteProperty')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Flex>
  );
};

const toProperties = (props: Array<StringObject>) => Object.fromEntries(props.map(entry => [entry.key, entry.value ?? '']));
