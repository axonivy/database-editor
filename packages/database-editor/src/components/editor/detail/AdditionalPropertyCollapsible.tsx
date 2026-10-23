import {
  addRow,
  BasicField,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  deleteFirstSelectedRow,
  dataTableHelper,
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
  TooltipTrigger
} from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, useTable } from '@tanstack/react-table';
import { useState } from 'react';
import { useDetailContext } from './DetailContext';

type StringObject = { key: string; value: string };

const { columnHelper, tableOptions } = dataTableHelper<StringObject>();

export const AdditionalCollapsible = () => {
  const { databaseConfig, updateDatabaseConfig } = useDetailContext();
  const [props, setProps] = useState(() => Object.entries(databaseConfig.additionalProperties).map(([key, value]) => ({ key, value })));

  const { t } = useTranslation();

  const columns = columnHelper.columns([
    columnHelper.accessor('key', {
      header: () => <span>{t('common.label.name')}</span>,
      cell: cell => <InputCell cell={cell} placeholder={t('database.placeholder.key')} />
    }),
    columnHelper.accessor('value', {
      header: () => <span>{t('common.label.value')}</span>,
      cell: cell => <InputCell cell={cell} placeholder={t('database.placeholder.value')} />
    })
  ]);

  const table = useTable({
    ...tableOptions,
    data: props,
    columns,
    meta: {
      updateData: (rowId, columnId, value) => {
        const stringValue = typeof value === 'string' ? value : '';
        const prop: StringObject =
          columnId === 'key'
            ? { key: stringValue, value: props[Number(rowId)]?.value ?? '' }
            : { key: props[Number(rowId)]?.key ?? '', value: stringValue };
        updateProperty(prop.key, prop.value, rowId);
      }
    }
  });

  const updateProperty = (key: string, value: string, rowId: string) => {
    const rowIndex = Number(rowId);
    const newProps = props.map(prop => ({ ...prop }));
    const updateProp = newProps[rowIndex];
    if (!Number.isInteger(rowIndex) || !updateProp) {
      return;
    }

    updateProp.key = key;
    updateProp.value = value;
    if (rowIndex === newProps.length - 1 && !isEmptyProperty(updateProp)) {
      newProps.push({ key: '', value: '' });
    }
    setProps(newProps);

    updateDatabaseConfig(database => {
      database.additionalProperties = toProperties(newProps.filter(prop => !isEmptyProperty(prop)));
    });
  };

  const addPropertyRow = () => {
    const newData = addRow(table, props, { key: '', value: '' });
    setProps(newData);
    updateDatabaseConfig(database => {
      database.additionalProperties = toProperties(newData.filter(prop => !isEmptyProperty(prop)));
    });
  };

  const deleteRow = () => {
    const { newData } = deleteFirstSelectedRow(table, props);
    setProps(newData);
    updateDatabaseConfig(database => {
      database.additionalProperties = toProperties(newData.filter(prop => !isEmptyProperty(prop)));
    });
  };

  return (
    <Collapsible>
      <CollapsibleTrigger>{t('database.additionalProperties')}</CollapsibleTrigger>
      <CollapsibleContent>
        <BasicField
          label={t('database.additionalProperties')}
          control={
            <TableControl
              addRow={addPropertyRow}
              deleteRow={deleteRow}
              canAddRow={props.length === 0 || !isEmptyProperty(props.at(-1))}
              hasSelection={table.getSelectedRowModel().flatRows.length !== 0}
            />
          }
        >
          <Table onFocusCapture={handleInputFocus} onKeyDownCapture={handleTabNavigation}>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} onClick={() => table.setRowSelection({})}>
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
  canAddRow: boolean;
  hasSelection: boolean;
};

const TableControl = ({ addRow, deleteRow, canAddRow, hasSelection }: TableControlProps) => {
  const { t } = useTranslation();
  return (
    <Flex direction='row' gap={2}>
      <TooltipProvider>
        {canAddRow && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button icon={IvyIcons.Plus} onClick={addRow} aria-label={t('detail.additionalProperties.addProperty')} />
            </TooltipTrigger>
            <TooltipContent>{t('detail.additionalProperties.addProperty')}</TooltipContent>
          </Tooltip>
        )}
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

const isEmptyProperty = (property?: StringObject) => property === undefined || (property.key === '' && property.value === '');

const toProperties = (props: Array<StringObject>) => Object.fromEntries(props.map(entry => [entry.key, entry.value ?? '']));

const handleInputFocus = (event: React.FocusEvent<HTMLTableElement>) => {
  if (event.target instanceof HTMLInputElement) {
    event.stopPropagation();
  }
};

const handleTabNavigation = (event: React.KeyboardEvent<HTMLTableElement>) => {
  if (event.key !== 'Tab' || !(event.target instanceof HTMLInputElement)) {
    return;
  }

  const table = event.currentTarget;
  const inputs = Array.from(table.querySelectorAll<HTMLInputElement>('tbody input'));
  const currentIndex = inputs.indexOf(event.target);
  const nextIndex = currentIndex + (event.shiftKey ? -1 : 1);
  const nextInput = inputs[nextIndex];
  const isLastInput = currentIndex === inputs.length - 1 && !event.shiftKey;
  const currentRowHasValue = Array.from(event.target.closest('tr')?.querySelectorAll<HTMLInputElement>('input') ?? []).some(input => input.value !== '');
  if (currentIndex >= 0 && (nextInput || (isLastInput && currentRowHasValue))) {
    event.preventDefault();
    event.target.blur();
    const focusIndex = nextInput ? nextIndex : inputs.length;
    window.setTimeout(() => table.querySelectorAll<HTMLInputElement>('tbody input')[focusIndex]?.focus(), 0);
  }
};
