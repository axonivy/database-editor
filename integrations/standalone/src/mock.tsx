import { ClientContextProvider, DatabaseEditor, initQueryClient } from '@axonivy/database-editor';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HotkeysProvider, ReadonlyProvider, ThemeProvider, Toaster } from '@axonivy/ui-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { DatabaseClientMock } from './mock/database-client-mock';
import { metaJdbcDriversStateParam, readonlyParam } from './url-helper';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('rootElement not found');
}
const root = ReactDOM.createRoot(rootElement);
const client = new DatabaseClientMock(metaJdbcDriversStateParam());
const queryClient = initQueryClient({ defaultOptions: { queries: { retry: false } } });

const readonly = readonlyParam();
initTranslation();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <ReadonlyProvider readonly={readonly}>
            <HotkeysProvider initiallyActiveScopes={['global']}>
              <DatabaseEditor context={{ app: '', projects: ['project1-name', 'project2-name'], file: '' }} directSave={true} />
            </HotkeysProvider>
          </ReadonlyProvider>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
        </QueryClientProvider>
      </ClientContextProvider>
      <Toaster closeButton={true} position='bottom-left' />
    </ThemeProvider>
  </React.StrictMode>
);
