import React from 'react'
import { FaFolder } from "react-icons/fa";

const FileCard = () => {
  return (
    <div className='bg-slate-600 hover:bg-slate-800 opacity-90 text-white p-3 h-12 flex gap-3 items-center font-semibold cursor-pointer'>
      <FaFolder/>Folder
    </div>
  )
}

export default FileCard
