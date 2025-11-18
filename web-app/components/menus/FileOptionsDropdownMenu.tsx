import React, { RefObject } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { BsThreeDotsVertical } from "react-icons/bs";

const FileOptionsDropdownMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BsThreeDotsVertical/>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Move</DropdownMenuItem>
        <DropdownMenuItem>Copy</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FileOptionsDropdownMenu
