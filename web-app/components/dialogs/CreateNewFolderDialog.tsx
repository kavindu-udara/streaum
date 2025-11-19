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
import toast from 'react-hot-toast';
import api from '@/axios';
import { Path, PathActions } from '@/types';
import { useRouter } from 'next/navigation';

const CreateNewFolderDialog = ({ triggerRef, path }: { triggerRef: RefObject<HTMLButtonElement | null>, path: Path }) => {

    const router = useRouter();
    const [name, setName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCancelButton = () => {
        setName("");
        triggerRef.current?.click();
    }

    const handleCreateButton = () => {
        if (!name) {
            toast.error("Please enter a folder name");
            return;
        }
        setIsLoading(true);
        api.post("/path-action", {
            action: "NEW_FOLDER",
            path: path.path,
            name
        }).then(res => {
            console.log(res)
            if (res.data.success) {
                toast.success("Folder Created Successfull");
                window.location.reload();
                return;
            }
            toast.error(res.data.message);
        }).catch(err => {
            console.error(err);
            toast.error(err.response.data.message || err.message || "Folder Create Failed");
        }).finally(() => {
            setIsLoading(false);
        }
        );
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
                    <Input type='text' placeholder='folder name' onChange={(e) => setName(e.target.value)} />
                    <div className='grid grid-cols-2 gap-5 mt-5'>
                        <Button onClick={handleCreateButton} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Create"}
                        </Button>
                        <Button variant={'secondary'} onClick={handleCancelButton} disabled={isLoading}>Cancel</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateNewFolderDialog
