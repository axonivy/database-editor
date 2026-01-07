import type { EditorProps } from '@axonivy/database-editor-protocol';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { AppProvider } from './AppContext';
import './DatabaseEditor.css';
import { DatabaseDetail } from './components/editor/detail/DatabaseDetail';
import { DatabaseMasterContent } from './components/editor/master/DatabaseMasterContent';
import { DatabaseMasterToolbar } from './components/editor/master/DatabaseMasterToolbar';

export const DatabaseEditor = (props: EditorProps) => {
  const [detail, setDetail] = useState(false);
  const [context, setContext] = useState(props.context);

  useEffect(() => {
    setContext(props.context);
  }, [props]);

  return (
    <AppProvider projects={props.context.projects} context={{ file: context.file, app: context.app, pmv: context.projects[0] ?? '' }}>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel>
          <DatabaseMasterToolbar detail={detail} setDetail={setDetail} />
          <DatabaseMasterContent setDetail={setDetail} />
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <DatabaseDetail />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
};
