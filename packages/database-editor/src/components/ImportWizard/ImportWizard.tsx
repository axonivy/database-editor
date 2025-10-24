import type { ImportWizardContext } from '@axonivy/database-editor-protocol';
import { Dialog, DialogContent, DialogTrigger, toast } from '@axonivy/ui-components';
import { useState, type ReactNode } from 'react';
import './ImportWizard.css';
import { WizardContent } from './WizardContent';

export const ImportWizard = ({
  context,
  children,
  callback
}: {
  context: ImportWizardContext;
  children: ReactNode;
  callback?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='database-editor-import-dialog'>
        <WizardContent context={context} setOpen={setOpen} callback={callback} />
      </DialogContent>
    </Dialog>
  );
};

export const notImplemented = () => toast.info('not yet implemented');
