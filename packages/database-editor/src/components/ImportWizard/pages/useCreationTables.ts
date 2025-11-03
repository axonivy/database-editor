import type { DatabaseColumn, DatabaseTable, ImportOptions, TableOptions } from '@axonivy/database-editor-protocol';
import { useState } from 'react';

export const useCreationTables = (namespace: string) => {
  const [tablesToCreate, setTablesToCreate] = useState<Map<string, Map<ImportOptions, Array<DatabaseColumn>>>>(new Map());

  const updateTablesToCreate = (table: DatabaseTable, type: ImportOptions, column?: DatabaseColumn, add: boolean = true) => {
    const addColumn = (col: DatabaseColumn) => {
      const tab = tablesToCreate.get(table.name) ?? new Map<ImportOptions, Array<DatabaseColumn>>();
      let update: Array<DatabaseColumn> = [];
      if (tab) {
        update = tab.get(type) ?? [];
      }
      update.push(col);
      tab.set(type, update);
      setTablesToCreate(current => new Map(current).set(table.name, tab));
    };

    const addTable = () => {
      const tab = tablesToCreate.get(table.name) ?? new Map<ImportOptions, Array<DatabaseColumn>>();
      tab.set(type, table.columns);
      setTablesToCreate(current => new Map(current).set(table.name, tab));
    };

    const removeColumn = (col: DatabaseColumn) => {
      const tab = tablesToCreate.get(table.name);
      if (!tab) {
        return;
      }
      let types = tab.get(type) ?? [];
      types = types.filter(c => c.name !== col.name);

      if (types.length === 0) {
        tab.delete(type);
      } else {
        tab.set(type, types);
      }
      setTablesToCreate(current => new Map(current).set(table.name, tab));
    };

    const removeType = () => {
      const tab = tablesToCreate.get(table.name);
      if (tab) {
        tab.delete(type);
        setTablesToCreate(current => new Map(current).set(table.name, tab));
      }
    };

    if (add && column) {
      addColumn(column);
    } else if (add) {
      addTable();
    } else if (column) {
      removeColumn(column);
    } else {
      removeType();
    }
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
