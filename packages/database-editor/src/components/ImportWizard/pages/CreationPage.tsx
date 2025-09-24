import type { DatabaseColumn, DatabaseTable, ImportOptions } from '@axonivy/database-editor-protocol';
import { BasicField, Checkbox, Flex, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { AttributeSelection } from '../components/AttributeSelection';
import { notImplemented } from '../ImportWizard';
import './CreationPage.css';
import { useNamespaceValidation } from './useNamespaceValidation';

export type CreationParameter = {
  tableName: string;
  Enum?: boolean;
  EntityClass?: boolean;
  Repository?: boolean;
  FormDialog?: boolean;
};

export type CreationPageProps = {
  tables: Array<DatabaseTable>;
  parameters: Map<string, Array<[DatabaseTable, ImportOptions]>>;
  updateSelection: (table: DatabaseTable, type: ImportOptions, column?: DatabaseColumn, add?: boolean) => void;
  namespace: string;
  updateNamespace: (ns: string) => void;
};

export const CreationPage = ({ tables, updateSelection, parameters, namespace, updateNamespace }: CreationPageProps) => {
  const { t } = useTranslation();

  const checkState = (tableName: string, key: ImportOptions): boolean => {
    const param = parameters.get(tableName);
    return param !== undefined && param.some(p => p[1] === key);
  };

  const namespaceMessage = useNamespaceValidation(namespace);

  return (
    <Flex direction='column' className='import-page creation-page'>
      <BasicField message={namespaceMessage} label={`${t('import.namespace')}*`}>
        <Input required value={namespace} onChange={event => updateNamespace(event.target.value)}></Input>
      </BasicField>
      <Table className='table-creation'>
        <TableHeader>
          <TableRow>
            <TableHead className='table-header table-name'>{t('import.table')}</TableHead>
            <TableHead className='table-header'>{t('import.entityClass')}</TableHead>
            <TableHead className='table-header'>{t('import.formDialog')}</TableHead>
            <TableHead className='table-header'>{t('import.attributes')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.map(table => (
            <TableRow key={table.name}>
              <TableCell>{table.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={checkState(table.name, 'EntityClass')}
                  onCheckedChange={value =>
                    updateSelection({ name: table.name, columns: [...table.columns] }, 'EntityClass', undefined, value as boolean)
                  }
                ></Checkbox>
              </TableCell>
              <TableCell>
                <Checkbox
                  onMouseOver={notImplemented}
                  checked={checkState(table.name, 'FormDialog')}
                  onCheckedChange={value =>
                    updateSelection({ name: table.name, columns: [...table.columns] }, 'FormDialog', undefined, value as boolean)
                  }
                ></Checkbox>
              </TableCell>
              <TableCell>
                <AttributeSelection updateSelection={updateSelection} creationTables={parameters} table={table} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Flex>
  );
};
