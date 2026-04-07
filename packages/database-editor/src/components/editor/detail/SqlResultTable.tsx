import type { ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { Flex, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@axonivy/ui-components';

export const SqlResultTable = ({ result }: { result: ExecuteSqlResponse }) => (
  <Flex direction='column' gap={1}>
    <Table>
      <TableHeader>
        <TableRow>
          {result.columns.map(col => (
            <TableHead key={col}>{col}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.rows.map((row, i) => (
          <TableRow key={i}>
            {result.columns.map(col => (
              <TableCell key={col}>{row[col]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Flex>
);
