import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

const Context = createContext<[DatabaseEditorContext, Dispatch<SetStateAction<DatabaseEditorContext>>] | undefined>(undefined);

export const ContextProvider = ({ context, children }: { context: DatabaseEditorContext; children: ReactNode }) => {
  const ctxState = useState<DatabaseEditorContext>(context);
  return <Context.Provider value={ctxState}>{children}</Context.Provider>;
};

export const useContextProvider = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error('useContextProvider must be used within an ContextProvider');
  }
  const [context, setContext] = ctx;
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

  return { context, setContext, updatePmv };
};
