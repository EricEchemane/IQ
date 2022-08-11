import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

export default function Register() {
    const router = useRouter();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace('/signin');
        }
    });

    return (
        <>
            <Head> <title> Register | Ayq </title> </Head>
            <form>
                <input type="email" disabled defaultValue={session?.user?.email || ''} placeholder='email' />
                <div>
                    <label htmlFor="student">Student</label>
                    <input type="radio" name='userType' id='student' />
                </div>
                <div>
                    <label htmlFor="professor">Professor</label>
                    <input type="radio" name='userType' id='professor' />
                </div>
                <div id='for-student'>
                    <input type="text" placeholder='Course' />
                    <input type="text" placeholder='Section' />
                </div>
                <div id='for-professor'>
                    <input type="text" placeholder='Admin passcode' />
                </div>
            </form>
        </>
    );
}
