import type { EditorProps } from '@axonivy/database-editor-protocol';
import { Button, Toolbar, ToolbarContainer, ToolbarTitle } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectionView } from './components/editor/ConnectionView';
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
          <ImportWizard context={context}>
            <Button icon={IvyIcons.SettingsCog} variant='primary'>
              {t('import.generate')}
            </Button>
          </ImportWizard>
        </Toolbar>
      </ToolbarContainer>
      <ConnectionView context={{ file: props.context.file, app: props.context.app, pmv: props.context.projects[0] ?? '' }} />
    </>
  );
};
