import type { DatabaseColumn, DatabaseTable, ImportOptions, TableOptions } from '@axonivy/database-editor-protocol';
import { useState } from 'react';

export const useCreationTables = (namespace: string) => {
  const [tablesToCreate, setTablesToCreate] = useState<Map<string, Map<ImportOptions, Array<DatabaseColumn>>>>(new Map());

  const updateTablesToCreate = (table: DatabaseTable, type: ImportOptions, column?: DatabaseColumn, add: boolean = true) => {
    setTablesToCreate(prev => {
      const next = new Map(prev);
      const nextTable = new Map(next.get(table.name) ?? new Map());

      if (add && column) {
        const cols = nextTable.get(type) ?? [];
        nextTable.set(type, [...cols, column]);
      } else if (add) {
        nextTable.set(type, [...table.columns]);
      } else if (column) {
        const cols: Array<DatabaseColumn> = nextTable.get(type) ?? [];
        nextTable.set(type, [...cols.filter(c => c.name !== column.name)]);
      } else {
        nextTable.delete(type);
      }
      next.set(table.name, nextTable);
      return next;
    });
  };

  const creationProps = (database: string): Array<TableOptions> => {
    const tableOptions: Array<TableOptions> = [];
    tablesToCreate.forEach((typeEntries, tableName) => {
      typeEntries.forEach((cols, t) => {
        tableOptions.push({
          database: database,
          namespace: namespace,
          type: t,
          table: {
            columns: cols,
            name: tableName,
            entityClassName: tableName
          }
        });
      });
    });
    return tableOptions;
  };

  return { tablesToCreate, setTablesToCreate, updateTablesToCreate, creationProps };
};
