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
import { Path } from '@/types';
import api from '@/axios';
import toast from 'react-hot-toast';

const FileOptionsDropdownMenu = ({ item }: { item: Path }) => {

  const handleDelete = () => {
    api.post("/path-action", {
      action: item.children.length > 0 ? "FORCE_DELETE" : "DELETE",
      path: item.path,
      name : item.name
    }).then(res => {
      console.log(res);
      if(res.data.success){
        toast.success("Delete Successful");
        window.location.reload();
        return;
      }
      toast.error(res.data.message);
    }).catch(err => {
      console.log(err);
      toast.error(err.response.data.message || err.message || "Delete Failed");
    })
  }

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
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FileOptionsDropdownMenu
