import type { EditorProps } from '@axonivy/database-editor-protocol';
import { Toolbar, ToolbarContainer, ToolbarTitle } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImportWizard } from './components/ImportWizard/ImportWizard';
import './DatabaseEditor.css';

export const DatabaseEditor = (props: EditorProps) => {
  const { t } = useTranslation();
  const [context, setContext] = useState(props.context);
  useEffect(() => {
    setContext(props.context);
  }, [props]);

  return (
    <>
      <ToolbarContainer>
        <Toolbar className='database-editor-main-toolbar'>
          <ToolbarTitle>{t('databaseEditor')}</ToolbarTitle>
        </Toolbar>
      </ToolbarContainer>
      <div className='editor'>
        <ImportWizard context={context} />
      </div>
    </>
  );
};
