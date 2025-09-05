import type { ImportWizardContext } from '@axonivy/database-editor-protocol';
import { Button, Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { pages, activePage, updateActivePage, jumpToPage, creationFunction } = usePages(importContext, setOpen);

  return (
    <Flex className='import-dialog-content' direction='column' justifyContent='space-between'>
      <Timeline pages={pages} active={activePage} setActive={jumpToPage} />
      {pages[activePage]?.page}
      <Flex direction='row' justifyContent='flex-end' gap={1}>
        <Button
          disabled={activePage <= 0}
          variant='outline'
          className='import-button-back'
          size='xl'
          onClick={() => updateActivePage(false)}
        >
          {t('import.back')}
        </Button>
        {activePage !== pages.length - 2 ? (
          <Button disabled={!pages[activePage]?.requiredData} variant='primary' size='xl' onClick={() => updateActivePage()}>
            {activePage === pages.length - 1 ? t('import.close') : t('import.next')}
            <IvyIcon icon={IvyIcons.Chevron} />
          </Button>
        ) : (
          <Button
            disabled={!pages[activePage]?.requiredData}
            variant='primary'
            size='xl'
            onClick={() => {
              creationFunction.mutate();
              if (callback) callback();
              updateActivePage();
            }}
          >
            {t('import.create')}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
