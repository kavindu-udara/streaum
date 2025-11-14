"use client"
import api from '@/axios'
import FolderOptionBar from '@/components/bars/FolderOptionBar'
import FileCard from '@/components/cards/FileCard'
import { Path } from '@/types'
import { useEffect, useState } from 'react'

const FilesPage = () => {
    const [paths, setPaths] = useState<Path | null>(null);

    const fetchFiles = (path? :string) => {
        api.get("/file-path", {
            params : {
                path
            }
        }).then(res => {
            console.log(res);
            console.log(JSON.parse(res.data.path));
            setPaths(JSON.parse(res.data.path));
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className='flex flex-col items-center gap-3 min-h-screen overflow-y-scroll '>
            <div className='container font-semibold'>
                {paths?.name}</div>
            <FolderOptionBar />
            <div className='grid grid-cols-5 gap-3 container h-min'>
                {paths?.children.map((item, index) => (
                    <FileCard key={index} item={item} fetchChildrens={fetchFiles} />
                ))}
            </div>
        </div>
    )
}

export default FilesPage
