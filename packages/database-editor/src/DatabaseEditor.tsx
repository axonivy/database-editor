import type { DatabaseInfoData, EditorProps } from '@axonivy/database-editor-protocol';
import { Table, TableBody, TableCell, TableRow, Toolbar, ToolbarContainer, ToolbarTitle } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImportWizard } from './components/ImportWizard';
import './DatabaseEditor.css';

export const DatabaseEditor = (props: EditorProps) => {
  const { t } = useTranslation();
  const [context, setContext] = useState(props.context);

  const listTables = (data: DatabaseInfoData) => {
    return (
      <div>
        <h2>Available Tables for {data.connectionName}</h2>
        <Table>
          <TableBody>
            {data.tables.map(t => (
              <TableRow>
                <TableCell>
                  <p>{t.name + ' Columns: ' + t.columns.map(d => d.name).join(', ')}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  useEffect(() => {
    setContext(props.context);
  }, [props]);

  return (
    <>
      <ToolbarContainer>
        <Toolbar>
          <ToolbarTitle>Database Editor</ToolbarTitle>
        </Toolbar>
      </ToolbarContainer>
      <div className='editor'>
        <ImportWizard context={context} />
      </div>
    </>
  );
};
