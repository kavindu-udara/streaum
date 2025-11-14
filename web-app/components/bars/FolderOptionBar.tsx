import React from 'react'
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import { MdCloudUpload } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoCaretForwardSharp } from "react-icons/io5";

const FolderOptionBar = () => {
    return (
        <div className='container bg-slate-600 opacity-90 hover:opacity-100 p-3 h-12 flex items-center justify-between'>
            <div className='flex gap-3 items-center'>
                <IoIosArrowBack size={25} className='cursor-pointer' />
                <IoIosArrowForward size={25} className='cursor-pointer' />
                Folder Name
                </div>
            <div className='flex gap-3 items-center'>
                <MdCheckBoxOutlineBlank size={25} className='cursor-pointer' />
                <MdCloudUpload size={25} className='cursor-pointer opacity-90 hover:opacity-100 text-white' />
                <MdCreateNewFolder size={25} className='cursor-pointer' />
                <MdDelete size={25} className='cursor-pointer' />
            </div>
        </div>
    )
}

export default FolderOptionBar
