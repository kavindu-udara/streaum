import ProfileSelectorCard from '@/components/cards/ProfileSelectorCard'

const LoginPage = () => {

    const userProfiles = [
        { name: "Kavindu", image: "https://i.pinimg.com/736x/d3/7b/b2/d37bb2baf327079bf16452bd9ca29c37.jpg" },
        { name: "Udara", image: "https://i.pinimg.com/736x/97/dd/2d/97dd2d96ee30d921ad4bdd2983453794.jpg" },
        { name: "Senura", image: "https://i.pinimg.com/736x/ac/55/8b/ac558b3cba65449f9ab916a8831c6735.jpg" },
        { name: "Dasun", image: "https://i.pinimg.com/736x/75/cf/a1/75cfa1ed5287df96dc7626be8e8ac42f.jpg" },
    ]

    return (
        <main className='flex flex-col gap-10 justify-center items-center min-h-screen w-full'>
            <h1 className='text-2xl font-semibold'>Select a Profile</h1>
            <div className='flex flex-row justify-center gap-5 container'>
                {userProfiles.map((profile, index) => (
                    <ProfileSelectorCard key={index} userName={profile.name} imageURL={profile.image} />
                ))}
            </div>
        </main>
    )
}

export default LoginPage
