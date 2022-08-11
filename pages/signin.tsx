import { signIn } from 'next-auth/react';
import React from 'react';

export default function Signin() {
    return (
        <>
            <div>Signin</div>
            <button onClick={() => signIn()}>Sign in</button>
        </>
    );
}
