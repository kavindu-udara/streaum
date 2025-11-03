import React, { MouseEventHandler, ReactNode } from 'react'

const PrimaryButton = ({children, onClick, className, disabled} : {children : ReactNode, onClick? : MouseEventHandler<HTMLButtonElement> | undefined, className? : string, disabled? : boolean | undefined}) => {
  return (
    <button onClick={onClick} className={`dark:bg-white dark:text-black bg-black text-white hover:dark:bg-white/95 hover:bg-slate-900 rounded-xl py-2 cursor-pointer ${className}`} disabled={disabled} >
      {children}
    </button>
  )
}

export default PrimaryButton
