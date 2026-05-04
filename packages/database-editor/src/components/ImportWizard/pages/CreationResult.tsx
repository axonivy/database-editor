import { ImportOptionsLookup, type CreationError } from '@axonivy/database-editor-protocol';
import {
  Flex,
  Label,
  Message,
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

export type CreationResultProps = {
  errors: Array<CreationError>;
};

export const CreationResult = ({ errors }: CreationResultProps) => {
  const { t } = useTranslation();
  return errors.length > 0 ? (
    <>
      <h3 className='m-0'>{t('import.errorsDuringCreation')}</h3>
      <ErrorTable errors={errors} />
    </>
  ) : (
    <Flex justifyContent='center' alignItems='center' role='region' aria-label={t('import.result')}>
      <h3 className='m-0'>{t('import.creationSuccess')}</h3>
    </Flex>
  );
};

const ErrorTable = ({ errors }: { errors: Array<CreationError> }) => {
  const { t } = useTranslation();

  const generateErrorMessage = (error: CreationError) => {
    if (error.message.endsWith(error.name)) {
      return t('import.errorAlreadyExists');
    }
    return error.message;
  };

  return (
    <Flex direction='column' gap={4} className='h-full overflow-auto' role='region' aria-label={t('import.result')}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-25 font-semibold'>{t('import.table')}</TableHead>
            <TableHead className='w-25 font-semibold'>{t('import.creationType')}</TableHead>
            <TableHead className='w-50 font-semibold'>{t('import.errorMessage')}</TableHead>
          </TableRow>
        </TableHeader>
        <TooltipProvider>
          <TableBody>
            {errors.map(error => (
              <TableRow key={error.name}>
                <TableCell className='max-w-0 truncate'>{error.name.substring(error.name.lastIndexOf('.') + 1)}</TableCell>
                <TableCell className='max-w-0 truncate'>
                  <Label>{ImportOptionsLookup[Number(error.type) as keyof typeof ImportOptionsLookup]}</Label>
                </TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableCell className='max-w-0 truncate'>
                      <Message variant='error'>{generateErrorMessage(error)}</Message>
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
