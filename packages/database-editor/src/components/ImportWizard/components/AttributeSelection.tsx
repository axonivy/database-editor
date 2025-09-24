import type { DatabaseColumn, DatabaseTable, ImportOptions } from '@axonivy/database-editor-protocol';
import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import './AttributeSelection.css';

export const AttributeSelection = ({
  table,
  creationTables,
  updateSelection
}: {
  table: DatabaseTable;
  creationTables: Map<string, Array<[DatabaseTable, ImportOptions]>>;
  updateSelection: (table: DatabaseTable, type: ImportOptions, column?: DatabaseColumn, add?: boolean) => void;
}) => {
  const { t } = useTranslation();

  const checkState = (attribute: string, key: ImportOptions): boolean => {
    const tableToCreate = creationTables.get(table.name);
    const state = tableToCreate?.find(t => t[1] === key);
    return state !== undefined && state[0].columns.some(c => c.name === attribute);
  };

  const updateTables = (type: ImportOptions, column: DatabaseColumn, add: boolean) => {
    if (add) {
      const update = creationTables.get(table.name)?.find(t => t[1] === type)?.[0].columns ?? [];
      update.push(column);
      updateSelection({ name: table.name, columns: update }, type);
    } else {
      updateSelection(table, type, column, false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='attribute-selection-trigger' icon={IvyIcons.Settings} />
      </PopoverTrigger>
      <PopoverContent className='attribute-selection-content' align='start'>
        <Table className='attribute-selection-table'>
          <TableHeader>
            <TableRow>
              <TableHead className='table-header'>{t('import.column')}</TableHead>
              <TableHead className='table-header'>{t('import.type')}</TableHead>
              <TableHead className='table-header'>{t('import.entityClass')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.columns.map(column => (
              <TableRow key={column.name}>
                <TableCell>{column.name}</TableCell>
                <TableCell>{column.type}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={checkState(column.name, 'EntityClass')}
                    onCheckedChange={checked => updateTables('EntityClass', column, checked as boolean)}
                  ></Checkbox>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
};
