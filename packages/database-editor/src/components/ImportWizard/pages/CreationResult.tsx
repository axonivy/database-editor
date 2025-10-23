import { ImportOptionsLookup, type CreationError } from '@axonivy/database-editor-protocol';
import {
  Flex,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import './CreationResult.css';

export type CreationResultProps = {
  errors: Array<CreationError>;
};

export const CreationResult = ({ errors }: CreationResultProps) => {
  const { t } = useTranslation();
  return errors.length > 0 ? (
    <>
      <h3 className='result-title'>{t('import.errorsDuringCreation')}</h3>
      <ErrorTable errors={errors} />
    </>
  ) : (
    <h3 className='result-title'>{t('import.creationSuccess')}</h3>
  );
};

const ErrorTable = ({ errors }: { errors: Array<CreationError> }) => {
  const { t } = useTranslation();

  const generateErrorMessage = (error: CreationError) => {
    if (error.name === error.message) {
      return t('import.errorAlreadyExists');
    }
    return error.message;
  };

  return (
    <Flex direction='column'>
      <Table className='table-errors'>
        <TableHeader>
          <TableRow>
            <TableHead className='table-header'>{t('import.table')}</TableHead>
            <TableHead className='table-header'>{t('import.creationType')}</TableHead>
            <TableHead className='table-header  table-message'>{t('import.errorMessage')}</TableHead>
          </TableRow>
        </TableHeader>
        <TooltipProvider>
          <TableBody>
            {errors.map(error => (
              <TableRow key={error.name}>
                <TableCell>{error.name.substring(error.name.lastIndexOf('.') + 1)}</TableCell>
                <TableCell>
                  <Label>{ImportOptionsLookup[Number(error.type) as keyof typeof ImportOptionsLookup]}</Label>
                </TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableCell>
                      <Label>{generateErrorMessage(error)}</Label>
                    </TableCell>
                  </TooltipTrigger>
                  <TooltipContent>{generateErrorMessage(error)}</TooltipContent>
                </Tooltip>
              </TableRow>
            ))}
          </TableBody>
        </TooltipProvider>
      </Table>
    </Flex>
  );
};
