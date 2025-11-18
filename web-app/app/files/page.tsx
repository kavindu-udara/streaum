"use client"
import api from '@/axios'
import FolderOptionBar from '@/components/bars/FolderOptionBar'
import FileCard from '@/components/cards/FileCard'
import FileOptionsDropdownMenu from '@/components/menus/FileOptionsDropdownMenu'
import { Path } from '@/types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const FilesPage = () => {
    const [paths, setPaths] = useState<Path | null>(null);

    const searchParams = useSearchParams();
    const paramPath = searchParams.get('path');

    const fetchFiles = (path?: string) => {
        api.get("/file-path", {
            params: {
                path: path
            }
        }).then(res => {
            console.log(res);
            console.log(JSON.parse(res.data.path));
            setPaths(JSON.parse(res.data.path));
        }).catch(err => {
            console.log(err);
        });
    }

    const toggleFileOptionDropdownMenu = () => {

    }

    useEffect(() => {
        if (paramPath) {
            fetchFiles(paramPath);
        } else {
            fetchFiles();
        }
    }, [paramPath]);

    return (
        <div className='flex flex-col items-center gap-3 min-h-screen overflow-y-scroll '>
            <div className='container font-semibold'>
                {paths?.name}</div>
            <FolderOptionBar />
            <div className='grid grid-cols-5 gap-3 container h-min'>
                {paths?.children.map((item, index) => (
                    <FileCard key={index} item={item} />
                ))}
            </div>
        </div>
    )
}

export default FilesPage
