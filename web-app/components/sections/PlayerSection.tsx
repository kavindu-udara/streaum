import { Song } from '@/types'
import Link from 'next/link';
import { IoMdClose } from "react-icons/io";
import YouTube from 'react-youtube'; // Import the package

const PlayerSection = ({song} : {song : Song}) => {

  // Extract video ID from the song's YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(song.link);

  // Player options
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1, // Auto-play the video
      controls: 1, // Show player controls
      modestbranding: 1, // Reduce YouTube logo
    },
  };

  return (
    <section className='flex justify-center items-center bg-black/50 absolute top-0 h-screen left-0 right-0'>
        <Link href={"/"} className='absolute right-5 top-5 z-10'>
            <IoMdClose size={50}/>
        </Link>
        <div>
            {videoId ? (
              <YouTube videoId={videoId} opts={opts} />
            ) : (
              <p>Invalid YouTube URL</p>
            )}
        </div>
    </section>
  )
}

export default PlayerSection