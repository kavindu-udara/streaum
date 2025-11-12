import Link from 'next/link';

const Header = () => {

    const navList = [
        { name: "Files", link: "/files" },
        { name: "Music", link: "/music" },
        { name: "Videos", link: "/videos" },
    ]

    return (
        <header className='flex justify-center items-center bg-black py-4 fixed left-0 right-0 z-100'>
            <ul className='flex flex-row gap-3'>
                {navList.map((link, i) => (
                    <li key={i}><Link href={link.link}>{link.name}</Link></li>
                ))}
            </ul>
        </header>
    )
}

export default Header
