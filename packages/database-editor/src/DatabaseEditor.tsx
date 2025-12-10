import { type DatabaseConnectionData, type EditorProps } from '@axonivy/database-editor-protocol';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectionView } from './components/editor/ConnectionView';
import { DatabaseMasterContext } from './components/editor/master/DatabaseMasterContent';
import { DatabaseMasterToolbar } from './components/editor/master/DatabaseMasterToolbar';
import './DatabaseEditor.css';

export const DatabaseEditor = (props: EditorProps) => {
  const { t } = useTranslation();
  const [context, setContext] = useState(props.context);
  const [detail, setDetail] = useState(false);
  const [activeConnection, setActiveConnection] = useState<DatabaseConnectionData>();
  useEffect(() => {
    setContext(props.context);
  }, [props]);

  return (
    <>
      <DatabaseMasterToolbar detail={detail} setDetail={setDetail} />
      <DatabaseMasterContext
        context={{ file: props.context.file, app: props.context.app, pmv: props.context.projects[0] ?? '' }}
        activeConnection={activeConnection}
        setActiveConnection={setActiveConnection}
      />
      <ConnectionView context={{ file: props.context.file, app: props.context.app, pmv: props.context.projects[0] ?? '' }} />
    </>
  );
};
