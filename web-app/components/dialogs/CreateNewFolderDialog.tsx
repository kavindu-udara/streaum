import React, { RefObject, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const CreateNewFolderDialog = ({ triggerRef }: { triggerRef: RefObject<HTMLButtonElement | null> }) => {

    const [name, setName] = useState<string>("");

    const handleCancelButton = () => {
        setName("");
        triggerRef.current?.click();
    }

    return (
        <Dialog>
            <DialogTrigger ref={triggerRef} className='hidden'>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-3'>
                    <Label>Folder Name</Label>
                    <Input type='text' placeholder='folder name' />
                    <div className='grid grid-cols-2 gap-5'>
                        <Button>Create</Button>
                        <Button variant={'secondary'} onClick={handleCancelButton}>Cancel</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateNewFolderDialog
