import TodoList from '@/components/Todo/TodoList';
import React from 'react';
import { UserContext } from '@/common/contexts/user.context';
import ProfileWidget from '@/components/User/ProfileWidget';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AppHome() {
    const userContext = React.useContext(UserContext);
    const router = useRouter();

    React.useEffect(() => {
        if (!userContext.user.token) {
            router.replace('/login');
        }
    }, [userContext.user.token]);

    return (
        <>
            <Head>
                <title>Home | Listlive</title>
            </Head>
            <div className="flex flex-col justify-center items-center min-h-screen bg-black overflow-y-auto">
                {userContext.user.token && <ProfileWidget />}
                <div className="flex flex-col rounded-lg bg-white p-5 pt-0 overflow-y-auto my-10">
                    {userContext.user.token && <TodoList />}
                </div>
            </div>
        </>
    );
}
