"use client"
import { RefObject, useRef } from 'react';
import { Profile } from '@/types';
import Image from 'next/image';
import { FaLock } from "react-icons/fa";
import gsap from 'gsap';

const ProfileSelectorCard = ({ profile, titleRef }: { profile: Profile, profiles: Profile[], titleRef: RefObject<HTMLHeadingElement | null> }) => {

    const cardRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const handleOnClick = () => {

        if (!cardRef.current) return;
        const el = cardRef.current;

        // Animate the card on click
        if (cardRef.current) {
            gsap.to(el, {
                x: 20,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut"
            });
        }

        // Animate titleRef to fade out
        if (titleRef.current) {
            gsap.to(titleRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power1.out"
            });
        }

    }

    return (
        <div ref={cardRef} id={`profile-selector-card-${profile.id}`} className='grayscale hover:grayscale-0 hover:font-semibold text-slate-600 dark:text-white hover:text-slate-800 dark:hover:text-white transition-transform duration-300 ease-in-out'>
            <div className='relative rounded-xl overflow-hidden flex items-center justify-center cursor-pointer shadow-sm hover:shadow-lg' onClick={handleOnClick}>
                <Image ref={imageRef} src={profile.imageURL} alt={profile.name} width={"150"} height={"150"} className={`profile-selector-card-image-${profile.id} hover:scale-120 transition-transform duration-300 ease-in-out`} unoptimized />
                {profile.isLocked && (
                    <span className='absolute bottom-2 right-2 text-slate-400 '>
                        <FaLock />
                    </span>
                )}
            </div>
            <div className={`profile-selector-card-name-${profile.id} text-center text-lg`}>
                {profile.name}
            </div>

            {profile.isLocked && (
                <div className='profile-selector-card-pin-input-div hidden flex-col gap-3 text-center text-sm dark:text-white text-slate-500 mt-1'>
                    <span className='border px-3 py-1 rounded-xl'>
                        <input type="password" className='border px-3 py-1 rounded-xl' placeholder='Enter PIN' />
                    </span>
                </div>
            )}

        </div>
    )
}

export default ProfileSelectorCard
