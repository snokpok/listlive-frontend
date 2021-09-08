import TodoList from '@/components/Todo/TodoList';
import React from 'react';
import { GetServerSideProps } from 'next';
import cookies from 'next-cookies';
import { UserContext } from '@/common/contexts/user.context';
import ProfileWidget from '@/components/User/ProfileWidget';

interface Props {
    token: string;
}

export default function AppHome({ token }: Props) {
    const userContext = React.useContext(UserContext);
    React.useEffect(() => {
        userContext.setUser({ token: token, id: userContext.user.id });
    }, [userContext.user.token, token]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black overflow-y-auto">
            {userContext.user.token && <ProfileWidget />}
            <div className="flex flex-col rounded-lg bg-white p-5 overflow-y-auto my-10">
                {userContext.user.token && <TodoList />}
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const c = cookies(context);
    return {
        props: {
            token: c.t,
        },
    };
};
