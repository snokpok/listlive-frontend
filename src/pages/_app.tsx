import React from 'react';
import { AppProps } from 'next/app';
import '@/styles/global.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { UserContext, UserInterface } from '@/common/contexts/user.context';

export default function MyApp({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();
    const [user, setUser] = React.useState<UserInterface>({
        token: '',
        id: '',
    });

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <UserContext.Provider value={{ user, setUser }}>
                    <Toaster />
                    <Component {...pageProps} />
                </UserContext.Provider>
            </QueryClientProvider>
        </>
    );
}
