import type { ImportWizardContext } from '@axonivy/database-editor-protocol';
import { Button, Flex, Toolbar, ToolbarContainer, ToolbarTitle } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ProceedButton } from './components/ProceedButton';
import { Timeline } from './components/Timeline';
import { usePages } from './pages/usePages';
import './WizardContent.css';

export type ImportPage = {
  page: ReactNode;
  title: string;
  identifier: string;
  requiredData: boolean;
};

export const WizardContent = ({
  context: importContext,
  setOpen,
  callback
}: {
  context: ImportWizardContext;
  setOpen: (open: boolean) => void;
  callback?: () => void;
}) => {
  const { t } = useTranslation();
  const { pages, activePage, updateActivePage, jumpToPage, creationFunction } = usePages(importContext, setOpen, callback);

  return (
    <Flex className='database-editor-import-wizard' direction={'column'}>
      <ToolbarContainer>
        <Toolbar>
          <ToolbarTitle>{t('import.generate')}</ToolbarTitle>
        </Toolbar>
      </ToolbarContainer>
      <Flex
        direction='column'
        className='database-editor-import-content'
        gap={4}
        justifyContent='space-between'
        style={{ height: '100%', overflow: 'auto' }}
      >
        <Timeline pages={pages} active={activePage} setActive={jumpToPage} />
        <Flex
          direction='column'
          gap={4}
          style={{ overflow: 'auto' }}
          className={`import-page database-${pages[activePage]?.identifier} database-import-margin`}
        >
          {pages[activePage]?.page}
        </Flex>
        <Flex direction='row' justifyContent='space-between' className='database-import-margin'>
          <Button variant='outline' onClick={() => setOpen(false)} icon={IvyIcons.Close}>
            {t('import.close')}
          </Button>
          <Flex direction='row' gap={2}>
            <Button disabled={activePage <= 0} variant='outline' onClick={() => updateActivePage(false)}>
              {t('import.back')}
            </Button>
            <ProceedButton
              disabled={!pages[activePage]?.requiredData}
              create={activePage === pages.length - 2}
              close={activePage === pages.length - 1}
              createFunction={creationFunction.mutate}
              pageUpdate={updateActivePage}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
