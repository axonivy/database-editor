import type { DatabaseColumn, DatabaseTable, ImportOptions, TableOptions } from '@axonivy/database-editor-protocol';
import { useState } from 'react';

export const useCreationTables = (namespace: string) => {
  const [tablesToCreate, setTablesToCreate] = useState<Map<string, Array<[DatabaseTable, ImportOptions]>>>(new Map());

  const updateTablesToCreate = (table: DatabaseTable, type: ImportOptions, column?: DatabaseColumn, add: boolean = true) => {
    const removeColumn = (column: DatabaseColumn) => {
      const update = tablesToCreate.get(table.name)?.find(t => t[1] === type)?.[0];
      if (update) {
        const i = update.columns.findIndex(e => e.name === column.name) ?? -1;
        update.columns.splice(i, 1);
        updateTablesToCreate(update, type, undefined, update.columns.length > 0);
      }
    };

    const removeImportOption = () => {
      const update = tablesToCreate.get(table.name)?.filter(t => t[1] !== type);
      if (update && update.length > 0) {
        setTablesToCreate(prev => new Map(prev).set(table.name, update));
      } else {
        setTablesToCreate(prev => {
          const copy = new Map(prev);
          copy.delete(table.name);
          return copy;
        });
      }
    };

    if (add) {
      setTablesToCreate(prev => new Map(prev).set(table.name, [[table, type]]));
    } else if (column) {
      removeColumn(column);
    } else {
      removeImportOption();
    }
  };

  const creationProps = (): Array<TableOptions> => {
    const tableOptions: Array<TableOptions> = [];
    tablesToCreate.forEach((value, key) => {
      value.forEach(v => {
        tableOptions.push({
          name: namespace + '.' + key,
          type: v[1] as ImportOptions,
          attributes: v[0].columns
        });
      });
    });
    return tableOptions;
  };

  return { tablesToCreate, setTablesToCreate, updateTablesToCreate, creationProps };
};
