import { Song } from '@/types'
import Link from 'next/link'
import React from 'react'

const SongCard = ({ song }: { song: Song }) => {
    return (
        <Link href={"?id=" + song.id}>
            <div className='h-56 overflow-hidden cursor-pointer'>
                <img
                    src={song.image}
                    alt={song.title}
                    className='hover:scale-105 transition-all duration-1000 ease-in-out hover:shadow-lg'
                />
            </div>
        </Link>
    )
}

export default SongCard
