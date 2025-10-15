import type { ImportWizardContext } from '@axonivy/database-editor-protocol';
import { Button, Flex } from '@axonivy/ui-components';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ProceedButton } from './components/ProceedButton';
import { Timeline } from './components/Timeline';
import { usePages } from './pages/usePages';

export type ImportPage = {
  page: ReactNode;
  title: string;
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
    <Flex className='import-dialog-content' direction='column' justifyContent='space-between'>
      <Timeline pages={pages} active={activePage} setActive={jumpToPage} />
      {pages[activePage]?.page}
      <Flex direction='row' justifyContent='space-between'>
        <Button variant='primary-outline' onClick={() => setOpen(false)}>
          {t('import.cancel')}
        </Button>
        <Flex direction='row' gap={1}>
          <Button
            disabled={activePage <= 0}
            variant='outline'
            className='import-button-back'
            size='xl'
            onClick={() => updateActivePage(false)}
          >
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
  );
};
