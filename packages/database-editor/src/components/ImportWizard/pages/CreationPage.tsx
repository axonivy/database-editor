import type { DatabaseColumn, DatabaseEditorDBContext, DatabaseTable, ImportOptions } from '@axonivy/database-editor-protocol';
import { BasicField, Checkbox, Flex, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMeta } from '../../../protocol/use-meta';
import { useContextProvider } from '../../../util/ContextProvider';
import { AttributeSelection } from '../components/AttributeSelection';
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
  tableNames: Array<string>;
  databaseName: string;
  parameters: Map<string, Map<ImportOptions, Array<DatabaseColumn>>>;
  updateSelection: (table: DatabaseTable, type: ImportOptions, column?: DatabaseColumn, add?: boolean) => void;
  namespace: string;
  updateNamespace: (ns: string) => void;
};

export const CreationPage = ({ tableNames, databaseName, updateSelection, parameters, namespace, updateNamespace }: CreationPageProps) => {
  const { t } = useTranslation();
  const { context } = useContextProvider();
  const infoContext: DatabaseEditorDBContext = useMemo(
    () => ({
      app: context.app,
      pmv: context.pmv,
      file: context.file,
      databaseName: databaseName,
      tableNames: tableNames
    }),
    [context, tableNames, databaseName]
  );

  const metaQuery = useMeta('meta/databaseTableInfo', infoContext);

  const checkState = (tableName: string, key: ImportOptions): boolean => {
    const param = parameters.get(tableName);
    return param !== undefined && param.has(key) && param.get(key)?.length !== 0;
  };

  const manageState = (table: DatabaseTable, type: ImportOptions, checked: boolean) => {
    const TRIGGERS: Array<ImportOptions> = ['FormDialog', 'Process'];
    if (type === 'EntityClass' || (checked && TRIGGERS.includes(type))) {
      updateSelection(
        { name: table.name, entityClassName: table.entityClassName, columns: [...table.columns] },
        'EntityClass',
        undefined,
        checked
      );
    }

    if (type === 'FormDialog' || (checked && type === 'Process')) {
      updateSelection(
        { name: table.name, entityClassName: table.entityClassName, columns: [...table.columns] },
        'FormDialog',
        undefined,
        checked
      );
    }
    if (type === 'Process') {
      updateSelection(
        { name: table.name, entityClassName: table.entityClassName, columns: [...table.columns] },
        'Process',
        undefined,
        checked
      );
    }
  };

  const namespaceMessage = useNamespaceValidation(namespace);

  return (
    <Flex direction='column' className='import-wizard-page' gap={4}>
      <BasicField message={namespaceMessage} label={`${t('import.namespace')}*`}>
        <Input required value={namespace} onChange={event => updateNamespace(event.target.value)}></Input>
      </BasicField>
      <Table className='table-creation'>
        <TableHeader>
          <TableRow>
            <TableHead className='table-header table-name'>{t('import.table')}</TableHead>
            <TableHead className='table-header'>{t('import.entityClass')}</TableHead>
            <TableHead className='table-header'>{t('import.formDialog')}</TableHead>
            <TableHead className='table-header'>{t('import.process')}</TableHead>
            <TableHead className='table-header'>{t('import.attributes')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metaQuery.data?.tables.map(table => (
            <TableRow key={table.name}>
              <TableCell>{table.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={checkState(table.name, 'EntityClass')}
                  onCheckedChange={value => manageState(table, 'EntityClass', value as boolean)}
                ></Checkbox>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={checkState(table.name, 'FormDialog')}
                  onCheckedChange={value => manageState(table, 'FormDialog', value as boolean)}
                ></Checkbox>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={checkState(table.name, 'Process')}
                  onCheckedChange={value => manageState(table, 'Process', value as boolean)}
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
