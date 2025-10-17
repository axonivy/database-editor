import type { DatabaseColumn, DatabaseTable, ImportOptions, TableOptions } from '@axonivy/database-editor-protocol';
import { useState } from 'react';

export const useCreationTables = (namespace: string) => {
  const [tablesToCreate, setTablesToCreate] = useState<Map<string, Array<[DatabaseTable, ImportOptions]>>>(new Map());

  const updateTablesToCreate = (table: DatabaseTable, type: ImportOptions, column?: DatabaseColumn, add: boolean = true) => {
    const updateColumn = (column: DatabaseColumn, generate: boolean) => {
      const update = tablesToCreate.get(table.name)?.filter(t => t[1] === type);
      if (update && update.length) {
        const table = update.find(t => t[1] === type)?.[0];
        if (!table) {
          return;
        }
        const col = table.columns.find(e => e.name === column.name);
        if (!col) {
          return;
        }
        col.generate = generate;
        setTablesToCreate(prev => new Map(prev).set(table.name, update));
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
      if (column) {
        updateColumn(column, true);
      }
    } else if (column) {
      updateColumn(column, false);
    } else {
      removeImportOption();
    }
  };

  const creationProps = (database: string): Array<TableOptions> => {
    const tableOptions: Array<TableOptions> = [];

    tablesToCreate.forEach(value => {
      value.forEach(v => {
        tableOptions.push({
          database: database,
          namespace: namespace,
          table: v[0],
          type: v[1] as ImportOptions
        });
      });
    });
    return tableOptions;
  };

  return { tablesToCreate, setTablesToCreate, updateTablesToCreate, creationProps };
};
