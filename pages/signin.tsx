import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function Signin() {
    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (session?.user) {
            router.replace('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user]);

    return (
        <>
            <div>Signin</div>
            <button onClick={() => signIn()}>Sign in</button>
        </>
    );
}
