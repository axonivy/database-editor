import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { BasicDialogContent, BasicField, Button, Dialog, DialogContent, DialogTrigger } from '@axonivy/ui-components';
import { useState } from 'react';
import { DatabaseSelection } from './DatabaseSelection';
import { DatabaseTableInfo } from './DatabaseTableInfo';
import './ImportWizard.css';

export const ImportWizard = ({ context }: { context: DatabaseEditorContext }) => {
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button variant='outline'>Wizard</Button>
      </DialogTrigger>
      <DialogContent className='import-wizard-dialog'>
        <BasicDialogContent
          className='import-wizard-dialog-content'
          cancel={<Button>Close</Button>}
          description=''
          submit={<Button>Submit</Button>}
          title='Import Wizard'
        >
          <BasicField label='Database'>
            <DatabaseSelection updateSelection={setSelectedDatabase} context={context} />
          </BasicField>
          <DatabaseTableInfo context={context} database={selectedDatabase} />
        </BasicDialogContent>
      </DialogContent>
    </Dialog>
  );
};
