import FolderOptionBar from '@/components/bars/FolderOptionBar'
import FileCard from '@/components/cards/FileCard'

const FilesPage = () => {
    return (
        <div className='flex flex-col items-center gap-3 min-h-screen overflow-y-scroll '>
            <FolderOptionBar/>
            <div className='grid grid-cols-5 gap-3 container h-min'>
                <FileCard/>
                <FileCard/>
                <FileCard/>
                <FileCard/>
                <FileCard/>
                <FileCard/>
                <FileCard/>
            </div>
        </div>
    )
}

export default FilesPage
