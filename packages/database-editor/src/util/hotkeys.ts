import { hotkeyText } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type KnownHotkey = { hotkey: string; label: string };

export const useKnownHotkeys = () => {
  const { t } = useTranslation();

  const addDatabaseConnection = useMemo<KnownHotkey>(() => {
    const hotkey = 'A';
    return { hotkey, label: t('hotkey.addDatabaseConnection', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const deleteDatabaseConnection = useMemo<KnownHotkey>(() => {
    const hotkey = 'Delete';
    return { hotkey, label: t('hotkey.deleteDatabaseConnection', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusToolbar = useMemo<KnownHotkey>(() => {
    const hotkey = '1';
    return { hotkey, label: t('common.hotkey.focusToolbar', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusMain = useMemo<KnownHotkey>(() => {
    const hotkey = '2';
    return { hotkey, label: t('common.hotkey.focusMain', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusInscription = useMemo<KnownHotkey>(() => {
    const hotkey = '3';
    return { hotkey, label: t('common.hotkey.focusInscription', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  return {
    addDatabaseConnection,
    deleteDatabaseConnection,
    focusToolbar,
    focusMain,
    focusInscription
  };
};
