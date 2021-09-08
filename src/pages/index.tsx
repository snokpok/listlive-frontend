import LoginForm from '@/components/Auth/LoginForm';
import React from 'react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-full">
            <LoginForm />
        </div>
    );
}
