import React from 'react'
import { FaFolder } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const FileCard = () => {
    return (
        <div className='bg-slate-600 hover:bg-slate-800 opacity-90 text-white p-3 h-12 flex justify-between gap-3 items-center font-semibold cursor-pointer'>
            <span className='flex items-center gap-3'>
                <FaFolder />Folder
                </span>
            <span>
                <BsThreeDotsVertical />
            </span>
        </div>
    )
}

export default FileCard
