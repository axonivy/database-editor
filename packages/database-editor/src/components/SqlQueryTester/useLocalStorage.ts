import { useState } from 'react';

type DispatchAction<T> = T | ((prevState: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (action: DispatchAction<T>) => {
    setValue(prev => {
      const next = typeof action === 'function' ? (action as (p: T) => T)(prev) : action;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore quota/serialization errors
      }
      return next;
    });
  };

  return [value, setStoredValue] as const;
}
