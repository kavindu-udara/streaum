"use client"
import SongCard from "@/components/cards/SongCard";
import PlayerSection from "@/components/sections/PlayerSection";
import { Song } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


const songs: Song[] = [
  {
    id: "1",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    image: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    title: "Never Gonna Give You Up",
    description: "Classic 80s pop by Rick Astley"
  },
  {
    id: "2",
    link: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    image: "https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    title: "Gangnam Style",
    description: "K-pop phenomenon by PSY"
  },
  {
    id: "3",
    link: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    image: "https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg",
    title: "Shape of You",
    description: "Pop hit by Ed Sheeran"
  },
  {
    id: "4",
    link: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    image: "https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    title: "Despacito",
    description: "Latin pop sensation by Luis Fonsi"
  },
  {
    id: "5",
    link: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    image: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
    title: "Bohemian Rhapsody",
    description: "Queen's iconic rock masterpiece"
  },
  {
    id: "6",
    link: "https://www.youtube.com/watch?v=QcIy9NiNbmo",
    image: "https://i.ytimg.com/vi/QcIy9NiNbmo/maxresdefault.jpg",
    title: "Bad Guy",
    description: "Billie Eilish's breakthrough hit"
  },
  {
    id: "7",
    link: "https://www.youtube.com/watch?v=60ItHLz5WEA",
    image: "https://i.ytimg.com/vi/60ItHLz5WEA/maxresdefault.jpg",
    title: "Blinding Lights",
    description: "The Weeknd's synthwave pop"
  },
  {
    id: "8",
    link: "https://www.youtube.com/watch?v=CTFtOOh47oo",
    image: "https://i.ytimg.com/vi/CTFtOOh47oo/maxresdefault.jpg",
    title: "Uptown Funk",
    description: "Mark Ronson ft. Bruno Mars"
  },
  {
    id: "9",
    link: "https://www.youtube.com/watch?v=ru0K8uYEZWw",
    image: "https://i.ytimg.com/vi/ru0K8uYEZWw/maxresdefault.jpg",
    title: "Levitating",
    description: "Dua Lipa's disco-pop anthem"
  },
  {
    id: "10",
    link: "https://www.youtube.com/watch?v=DYed5whEf4g",
    image: "https://i.ytimg.com/vi/DYed5whEf4g/maxresdefault.jpg",
    title: "Stay",
    description: "The Kid LAROI & Justin Bieber"
  }
];

export default function Home() {

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [songId, setSongId] = useState<string | null>(null);

  const checkSongExists = (songId: string | null): boolean => {
    if (!songId) return false;
    return songs.some(song => song.id === songId);
  };

  const getSongById = (songId: string | null): Song | undefined => {
    if (!songId) return undefined;
    return songs.find(song => song.id === songId);
  };

  const currentSong = getSongById(songId);

  useEffect(() => {
    if (id && checkSongExists(id)) {
      setSongId(id);
    } else {
      setSongId(null);
    }
  }, [id]);

  return (
    <div className={`flex flex-row justify-center font-sans  bg-cover bg-no-repeat relative ${currentSong && 'max-h-screen overflow-y-hidden'} `}>
      <div className="grid grid-cols-3 gap-5 py-5 container">
        {songs.map(song => (
          <SongCard song={song} key={song.id} />
        ))}
      </div>
      {currentSong && (
        <PlayerSection song={currentSong} />
      )}
    </div>
  );
}