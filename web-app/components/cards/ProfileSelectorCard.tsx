import Image from 'next/image'
import React from 'react'

const ProfileSelectorCard = ({ imageURL, userName }: { imageURL: string, userName: string }) => {
    return (
        <div className='hover:font-semibold text-slate-600 hover:text-slate-800'>
            <div className='rounded-xl overflow-hidden flex items-center justify-center cursor-pointer shadow-sm hover:shadow-lg'>
                <Image src={imageURL} alt='profile-image' width={"150"} height={"150"} className='grayscale hover:grayscale-0 hover:scale-120 transition-transform duration-300 ease-in-out' unoptimized />
            </div>
            <div className='text-center text-lg'>
                {userName}
            </div>
        </div>
    )
}

export default ProfileSelectorCard
