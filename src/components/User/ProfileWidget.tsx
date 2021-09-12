import { serverConfigs } from '@/common/configs';
import { UserContext } from '@/common/contexts/user.context';
import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';
import BarLoader from 'react-spinners/BarLoader';
import LogoutWidget from '../Auth/LogoutWidget';

interface PropsUserWidget {
    token: string | null;
}

export default function ProfileWidget() {
    const userContext = React.useContext(UserContext);
    const queryProfile = useQuery('get-profile', () => {
        return axios({
            method: 'get',
            url: `${serverConfigs.backend_dev}/me`,
            headers: {
                Authorization: `Bearer ${userContext.user.token}`,
            },
        });
    });

    return (
        <div className="flex rounded-lg bg-white p-2 space-x-2 min-w-60">
            <div className="bg-black w-1/3"></div>
            <div className="flex flex-col">
                <div className="font-bold">
                    <div>
                        {queryProfile.data?.data.first_name}{' '}
                        {queryProfile.data?.data.last_name}
                    </div>
                </div>
                {!queryProfile.data?.data ? <BarLoader loading={true} /> : null}
                <div className="text-gray-500 font-light">
                    {queryProfile.data?.data.email}
                </div>
            </div>
            <LogoutWidget />
        </div>
    );
}
