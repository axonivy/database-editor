import type { ImportWizardContext } from '@axonivy/database-editor-protocol';
import { Button, cn, Flex } from '@axonivy/ui-components';
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
    <Flex
      direction='column'
      gap={4}
      style={{ overflow: 'auto' }}
      justifyContent='space-between'
      className={`database-${pages[activePage]?.identifier} database-editor-import-content`}
    >
      <Timeline pages={pages} active={activePage} setActive={jumpToPage} />
      {pages[activePage]?.page}
      <Flex direction='row' justifyContent='space-between'>
        <Button
          variant='outline'
          onClick={() => setOpen(false)}
          className={cn(activePage >= pages.length - 1 && 'import-wizard-close-hidden')}
        >
          {t('import.cancel')}
        </Button>
        <Flex direction='row' gap={2} justifyContent='flex-end' className='import-wizard-proceed-buttons'>
          <Button
            disabled={activePage <= 0}
            icon={IvyIcons.Chevron}
            rotate={180}
            variant='primary-outline'
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
