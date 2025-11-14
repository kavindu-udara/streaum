import React from 'react'
import { FaFolder, FaFile } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Path } from '@/types';
import { useRouter } from 'next/navigation';

const FileCard = ({ item }: { item: Path}) => {

    const router = useRouter();

    return (
        <div className='bg-slate-600 hover:bg-slate-800 opacity-90 text-white p-3 h-12 flex justify-between gap-3 items-center font-semibold cursor-pointer' onClick={() => item.isDirectory ? router.push(`/files?path=${item.path}`) : null} >
            <span className='flex items-center gap-3'>
                {item.isDirectory ? (
                    <FaFolder />
                ) : (
                    <FaFile />
                )}
                {item.name}
            </span>
            <span>
                <BsThreeDotsVertical />
            </span>
        </div>
    )
}

export default FileCard
