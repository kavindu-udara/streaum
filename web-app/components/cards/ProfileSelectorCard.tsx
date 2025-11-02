"use client"
import { RefObject, useRef } from 'react';
import { Profile } from '@/types';
import Image from 'next/image';
import { FaLock } from "react-icons/fa";
import gsap from 'gsap';

const ProfileSelectorCard = ({ profile, profiles, titleRef }: { profile: Profile, profiles: Profile[], titleRef: RefObject<HTMLHeadingElement | null> }) => {

    const cardRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const handleOnClick = () => {
        console.log(`Profile selected: ${profile.name}`);

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

        // add class name hidden for other profiles except current one
        profiles.forEach(item => {
            if (item.id == profile.id) return;
            const otherCard = document.getElementById(`profile-selector-card-${item.id}`);
            otherCard?.classList.add('hidden');

            if (otherCard) {
                gsap.to(otherCard as HTMLElement, { opacity: 0, duration: 0.3, ease: "power1.out" });
            }
        });

        // create a fixed-position clone and animate that to perfect center
        const rect = el.getBoundingClientRect();

        const clone = el.cloneNode(true) as HTMLElement;
        // reset any transform on the clone and position it exactly over the original
        clone.style.position = 'fixed';
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.margin = '0';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.transform = 'none';
        document.body.appendChild(clone);

        // hide original while clone animates
        el.style.visibility = 'hidden';

        const targetLeft = window.innerWidth / 2 - rect.width / 2;
        const targetTop = window.innerHeight / 2 - rect.height / 2;

        const tl = gsap.timeline();

        tl.to(clone, {
            left: targetLeft,
            top: targetTop,
            scale: 1.2,
            duration: 0.35,
            ease: "power2.out",
            transformOrigin: 'center center',
            onComplete: () => {
                const imgInClone = clone.querySelector(`.profile-selector-card-image-${profile.id}`) as HTMLElement | null;
                const nameInClone = clone.querySelector(`.profile-selector-card-name-${profile.id}`) as HTMLElement | null;
                const pinDivInClone = clone.querySelector('.profile-selector-card-pin-input-div') as HTMLElement | null;

                imgInClone?.classList.remove('grayscale', 'hover:scale-120');
                imgInClone?.classList.add('scale-120');

                nameInClone?.classList.add('font-semibold', 'text-slate-800', 'dark:text-white');

                if (pinDivInClone) {
                    pinDivInClone.classList.remove('hidden');
                    // focus input so user can type right away
                    const input = pinDivInClone.querySelector('input') as HTMLInputElement | null;
                    input?.focus();
                }

                clone.style.pointerEvents = 'auto';
            }
        }).to(clone, {
            scale: 1.1,
            filter: 'grayscale(0%)',
            duration: 0.35,
            ease: "power2.out"
        }, "-=0.25")
            .to(
                ".profile-selector-card-pin-input-div", {
                display: "flex",
                duration: 0.3,
                ease: "power1.out"
            });

        if (profile.isLocked) {
            document.querySelector('.profile-selector-card-pin-input-div')?.classList.remove('hidden');
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
                    <input type="text" className='border px-3 py-1 rounded-xl' placeholder='Enter PIN' />
                </div>
            )}

        </div>
    )
}

export default ProfileSelectorCard
