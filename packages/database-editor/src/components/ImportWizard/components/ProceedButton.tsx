import { Button, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';

export type ProceedButtonProps = {
  create: boolean;
  close: boolean;
  disabled: boolean;
  createFunction: () => void;
  pageUpdate: () => void;
};

export const ProceedButton = ({ create, close, disabled, createFunction, pageUpdate }: ProceedButtonProps) => {
  const { t } = useTranslation();
  if (create) {
    return (
      <Button
        disabled={disabled}
        variant='primary'
        size='xl'
        onClick={() => {
          createFunction();
          pageUpdate();
        }}
      >
        {t('import.create')}
      </Button>
    );
  }
  return (
    <Button disabled={disabled} variant='primary' size='xl' onClick={() => pageUpdate()}>
      {close ? t('import.close') : t('import.next')}
      <IvyIcon icon={IvyIcons.Chevron} />
    </Button>
  );
};
