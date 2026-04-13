import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { createContext, use, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

const Context = createContext<{ context: DatabaseEditorContext; setContext: Dispatch<SetStateAction<DatabaseEditorContext>> } | undefined>(
  undefined
);

export const ContextProvider = ({ initContext, children }: { initContext: DatabaseEditorContext; children: ReactNode }) => {
  const [context, setContext] = useState<DatabaseEditorContext>(initContext);
  return <Context value={{ context, setContext }}>{children}</Context>;
};

export const useContextProvider = () => {
  const ctx = use(Context);
  if (!ctx) {
    throw new Error('useContextProvider must be used within an ContextProvider');
  }
  const { context, setContext } = ctx;
  const updatePmv = (pmv: string, callback?: (value: string) => void) => {
    setContext(prev => {
      const update: DatabaseEditorContext = {
        ...prev,
        pmv
      };
      return update;
    });
    if (callback) {
      callback(pmv);
    }
  };

  return { context, updatePmv };
};
