import type { ImportWizardContext } from '@axonivy/database-editor-protocol';
import { Button, DialogFooter, DialogHeader, DialogTitle, Flex } from '@axonivy/ui-components';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ProceedButton } from './components/ProceedButton';
import { Timeline } from './components/Timeline';
import { usePages } from './pages/usePages';

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
    <Flex direction='column' gap={4} style={{ overflow: 'auto' }}>
      <DialogHeader>
        <DialogTitle>{t('import.generate')}</DialogTitle>
      </DialogHeader>
      <Timeline pages={pages} active={activePage} setActive={jumpToPage} />
      <Flex direction='column' gap={4} justifyContent='space-between' style={{ height: '100%', overflow: 'auto' }}>
        <Flex
          direction='column'
          gap={4}
          style={{ overflow: 'auto' }}
          className={`database-editor-import-page-${pages[activePage]?.identifier}`}
        >
          {pages[activePage]?.page}
        </Flex>
        <DialogFooter>
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
        </DialogFooter>
      </Flex>
    </Flex>
  );
};
