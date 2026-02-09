import { Button } from '@axonivy/ui-components';
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
        size='large'
        icon={IvyIcons.SettingsCog}
        onClick={() => {
          createFunction();
          pageUpdate();
        }}
      >
        {t('import.generate')}
      </Button>
    );
  }
  return (
    <Button
      disabled={disabled}
      variant='primary'
      size='large'
      onClick={() => pageUpdate()}
      icon={close ? IvyIcons.Check : IvyIcons.Chevron}
    >
      {close ? t('import.finish') : t('import.next')}
    </Button>
  );
};
