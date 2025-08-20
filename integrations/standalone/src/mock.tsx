import { ClientContextProvider, DatabaseEditor, initQueryClient, QueryProvider } from '@axonivy/database-editor';
import { ThemeProvider, Toaster } from '@axonivy/ui-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { DatabaseClientMock } from './mock/database-client-mock';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('rootElement not found');
}
const root = ReactDOM.createRoot(rootElement);
const client = new DatabaseClientMock();
const queryClient = initQueryClient();
initTranslation();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryProvider client={queryClient}>
          <DatabaseEditor context={{ app: '', pmv: 'project-name', file: '' }} />
        </QueryProvider>
      </ClientContextProvider>
      <Toaster closeButton={true} position='bottom-left' />
    </ThemeProvider>
  </React.StrictMode>
);
