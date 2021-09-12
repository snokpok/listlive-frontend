import { UserContext } from '@/common/contexts/user.context';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import AppLogo from '@/public/listlive-icon.png';
import Image from 'next/image';

export default function Home() {
    const router = useRouter();
    const userContext = React.useContext(UserContext);

    if (userContext.user.token) {
        router.replace('/app');
        return null;
    }

    return (
        <>
            <Head>
                <title>Making productivity social | Livelist</title>
            </Head>
            <div className="bg-black text-white min-h-screen flex flex-col justify-center items-center space-y-4">
                <div className="text-7xl font-bold flex items-center">
                    <Image src={AppLogo} width={90} height={90} />
                    <div>Listlive</div>
                </div>
                <div className="flex flex-col p-2 text-lg font-semibold">
                    We're making what have always been boring... Into something
                    fun.
                </div>
                <div className="flex space-x-2">
                    <button
                        className="p-4 bg-green-500 rounded-lg transition hover:opacity-90 text-white"
                        onClick={() => {
                            router.push('/login');
                        }}
                    >
                        Login
                    </button>
                    <button
                        className="p-4 bg-green-500 rounded-lg transition hover:opacity-90 text-white"
                        onClick={() => {
                            router.push('/register');
                        }}
                    >
                        Register
                    </button>
                </div>
            </div>
        </>
    );
}
