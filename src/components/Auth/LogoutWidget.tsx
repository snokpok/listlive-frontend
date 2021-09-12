import { UserContext } from '@/common/contexts/user.context';
import { logOutHandler } from '@/common/web/functions';
import { useRouter } from 'next/router';
import React from 'react';

function LogoutWidget() {
    const router = useRouter();
    const userContext = React.useContext(UserContext);

    return (
        <button
            onClick={() => {
                userContext.setUser({
                    token: '',
                    id: '',
                });
                logOutHandler();
                router.replace('/');
            }}
            className="hover:bg-red-400 text-white bg-red-500 rounded-lg p-3 transition"
        >
            Logout
        </button>
    );
}

export default LogoutWidget;
