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
  creationTables: Map<string, Map<ImportOptions, Array<DatabaseColumn>>>;
  updateSelection: (table: DatabaseTable, type: ImportOptions, column?: DatabaseColumn, add?: boolean) => void;
}) => {
  const { t } = useTranslation();

  const checkState = (attribute: string, key: ImportOptions): boolean => {
    const tableToCreate = creationTables.get(table.name);
    const column = tableToCreate?.get(key)?.find(c => c.name === attribute);
    return column !== undefined;
  };

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button className='attribute-selection-trigger' icon={IvyIcons.Settings} />
      </PopoverTrigger>
      <PopoverContent className='attribute-selection-content' align='start'>
        <Table className='attribute-selection-table'>
          <TableHeader>
            <TableRow>
              <TableHead className='table-header'>{t('import.column')}</TableHead>
              <TableHead className='table-header'>{t('import.type')}</TableHead>
              <TableHead className='table-header'>{t('import.generate')}</TableHead>
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
                    onCheckedChange={checked => {
                      // Update attributes for all creation types, this will be split at a later date
                      updateSelection(table, 'EntityClass', column, checked as boolean);
                      updateSelection(table, 'FormDialog', column, checked as boolean);
                      updateSelection(table, 'Process', column, checked as boolean);
                    }}
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
