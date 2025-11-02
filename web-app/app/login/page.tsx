"use client"
import ProfileSelectorCard from '@/components/cards/ProfileSelectorCard'
import { Profile } from '@/types'
import { useRef } from 'react';

const LoginPage = () => {

    const titleRef = useRef<HTMLHeadingElement | null>(null);

    const userProfiles : Profile[] = [
        { id : "1", name: "Kavindu", imageURL: "https://i.pinimg.com/736x/d3/7b/b2/d37bb2baf327079bf16452bd9ca29c37.jpg", isLocked : true },
        { id : "2", name: "Udara", imageURL: "https://i.pinimg.com/736x/97/dd/2d/97dd2d96ee30d921ad4bdd2983453794.jpg", isLocked : false },
        { id : "3", name: "Senura", imageURL: "https://i.pinimg.com/736x/ac/55/8b/ac558b3cba65449f9ab916a8831c6735.jpg", isLocked : false },
        { id : "4", name: "Dasun", imageURL: "https://i.pinimg.com/736x/75/cf/a1/75cfa1ed5287df96dc7626be8e8ac42f.jpg", isLocked : true },
    ];

    return (
        <main className='flex flex-col gap-10 justify-center items-center min-h-screen w-full'>
            <h1 ref={titleRef} className='text-2xl font-semibold'>Select a Profile</h1>
            <div className='flex flex-row justify-center gap-5 container'>
                {userProfiles.map((profile, index) => (
                    <ProfileSelectorCard profiles={userProfiles} key={index} profile={profile} titleRef={titleRef} />
                ))}
            </div>
        </main>
    );

}

export default LoginPage
