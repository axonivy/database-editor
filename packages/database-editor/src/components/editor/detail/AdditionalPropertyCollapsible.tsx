import {
  BasicField,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  InputCell,
  SelectRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useTableSelect
} from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';

import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

type StringObject = { key: string; value: string | undefined };

export const AdditionalCollapsible = ({ updateData }: { updateData: (update: DatabaseConfigurationData) => void }) => {
  const { activeDb, setActiveDb } = useAppContext();
  const props = useMemo(
    () => Object.entries(activeDb?.additionalProperties ?? []).map(entry => ({ key: entry[0] as string, value: entry[1] as string })),
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

  const addRow = () => {
    setActiveDb(prev => {
      if (!prev) return;
      const update = { ...prev };
      update.additionalProperties[t('database.placeholder.key')] = t('database.placeholder.value');
      updateData(update);
      return update;
    });
  };

  const deleteRow = () => {
    const key = table.getSelectedRowModel().rows.at(0)?.original.key;
    if (!key) {
      return;
    }
    setActiveDb(prev => {
      if (!prev) {
        return;
      }
      const update = { ...prev };

      update.additionalProperties = Object.fromEntries(Object.entries(update.additionalProperties).filter(entry => entry[0] !== key));
      updateData(update);
      return update;
    });
  };

  const updateProperty = (key: string, value: string, oldKey: string) => {
    setActiveDb(prev => {
      if (!prev) return;
      const entries = Object.entries({ ...prev.additionalProperties }).map(obj => {
        if (obj[0] === oldKey || obj[0] === key) {
          obj[0] = key;
          obj[1] = value;
        }
        return obj;
      });
      const update = {
        ...prev,
        additionalProperties: Object.fromEntries(entries)
      };
      updateData(update);
      return update;
    });
  };

  return (
    <Collapsible>
      <CollapsibleTrigger>{t('database.additionalProperties')}</CollapsibleTrigger>
      <CollapsibleContent>
        <BasicField label={t('database.additionalProperties')} control={<TableControl addRow={addRow} deleteRow={deleteRow} />}>
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

const TableControl = ({ addRow, deleteRow }: { addRow: () => void; deleteRow: () => void }) => {
  return (
    <Flex direction='row' gap={2}>
      <Button icon={IvyIcons.Plus} onClick={addRow} />
      <Button icon={IvyIcons.Trash} onClick={deleteRow} />
    </Flex>
  );
};
