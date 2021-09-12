import React from 'react';
import App, { AppContext, AppProps } from 'next/app';
import '@/styles/global.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { UserContext, UserInterface } from '@/common/contexts/user.context';
import LoadingScreen from '@/components/Misc/LoadingScreen';
import cookies from 'next-cookies';
import { useRouter } from 'next/router';

export default function MyApp({
    Component,
    pageProps,
    c,
}: AppProps & { c: Record<string, string> }) {
    const queryClient = new QueryClient();
    const [user, setUser] = React.useState<UserInterface>({
        token: '',
        id: '',
    });
    const [appReady, setAppReady] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        if (c.t) {
            setUser({ token: c.t, id: '' });
            router.replace('/app');
        }
        setTimeout(() => {
            setAppReady(true);
        }, 1500);
    }, [c.t]);

    if (!appReady) {
        return <LoadingScreen />;
    }

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

MyApp.getInitialProps = async (ctx: AppContext) => {
    const appProps = await App.getInitialProps(ctx);
    const c = cookies(ctx.ctx);
    return {
        ...appProps,
        c,
    };
};
