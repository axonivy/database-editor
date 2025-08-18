import type { DatabaseTable } from '@axonivy/database-editor-protocol';
import { Checkbox, Flex, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import './CreationPage.css';

export type CreationParameter = {
  tableName: string;
  enum?: boolean;
  entity?: boolean;
  repository?: boolean;
};

export type CreationPageProps = {
  tables: Array<DatabaseTable>;
  parameters: Array<CreationParameter>;
  updateSelection: (table: string, key: Exclude<keyof CreationParameter, 'tableName'>, value: boolean) => void;
};

export const CreationPage = ({ tables, updateSelection, parameters }: CreationPageProps) => {
  const { t } = useTranslation();

  const checkState = (tableName: string, key: Exclude<keyof CreationParameter, 'tableName'>): boolean => {
    const param = parameters.find(p => p.tableName === tableName);
    if (!param) return false;
    return param[key] === true;
  };

  return (
    <Flex direction='column' className='import-page'>
      <Table className='table-creation'>
        <TableHeader>
          <TableRow>
            <TableHead className='table-header'>{t('import.table')}</TableHead>
            <TableHead className='table-header'>{t('import.enum')}</TableHead>
            <TableHead className='table-header'>{t('import.entityClass')}</TableHead>
            <TableHead className='table-header'>{t('import.repository')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.map(table => (
            <TableRow key={table.name}>
              <TableCell>{table.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={checkState(table.name, 'enum')}
                  onCheckedChange={value => updateSelection(table.name, 'enum', value as boolean)}
                ></Checkbox>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={checkState(table.name, 'entity')}
                  onCheckedChange={value => updateSelection(table.name, 'entity', value as boolean)}
                ></Checkbox>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={checkState(table.name, 'repository')}
                  onCheckedChange={value => updateSelection(table.name, 'repository', value as boolean)}
                ></Checkbox>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Flex>
  );
};
