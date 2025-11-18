import React, { useRef } from 'react'
import { FaFolder, FaFile } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Path } from '@/types';
import { useRouter } from 'next/navigation';
import FileOptionsDropdownMenu from '../menus/FileOptionsDropdownMenu';

const FileCard = ({ item }: { item: Path }) => {

    const router = useRouter();

    return (
        <div className='bg-slate-600 hover:bg-slate-800 opacity-90 text-white p-3 h-12 flex justify-between gap-3 items-center font-semibold cursor-pointer'  >
            <span className='flex items-center gap-3' onClick={() => item.isDirectory ? router.push(`/files?path=${item.path}`) : null}>
                {item.isDirectory ? (
                    <FaFolder />
                ) : (
                    <FaFile />
                )}
                {item.name}
            </span>

            <FileOptionsDropdownMenu item={item} />
        </div>
    )
}

export default FileCard
