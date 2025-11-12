import { Song } from '@/types'
import Link from 'next/link';
import { IoMdClose } from "react-icons/io";
import YouTube from 'react-youtube'; // Import the package

const PlayerSection = ({ song }: { song: Song }) => {

    const getVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(song.link);

    const opts = {
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
        },
    };

    return (
        <section className='flex flex-col items-center   absolute top-0 h-screen left-0 right-0 z-10'>
            <Link href={"/"} className='absolute right-5 top-5 z-10' aria-label='close'>
                <IoMdClose size={50} aria-label='close' title='close' />
            </Link>

            <img src={song.image} alt="cover-image" className='w-full z-1 fixed' />

            <div className='w-full mt-[100px] p-5 flex flex-col items-center bg-linear-to-b from-transparent via-black to-black z-10 h-full'>
                <div className='container '>
                    {videoId ? (
                        <YouTube videoId={videoId} opts={opts} className='' />
                    ) : (
                        <p>Invalid YouTube URL</p>
                    )}
                </div>
                <div className='container flex flex-col gap-5 '>
                    <h1 className='text-3xl'>{song.title}</h1>
                    <p>{song.description}</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem consectetur, quos consequatur quaerat saepe delectus accusamus praesentium. Aut cupiditate quos, eos sunt libero veniam dolorem in impedit doloribus unde ex.</p>
                </div>
            </div>
        </section>
    )
}

export default PlayerSection