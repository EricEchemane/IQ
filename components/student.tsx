import useUserState, { UserActions, UserStateType } from 'lib/user-context/student';
import { signOut } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect } from 'react';

export default function Student({ data }: any) {
    const { dispatch, state }: UserStateType = useUserState();

    useEffect(() => {
        dispatch({
            type: UserActions.set_user,
            payload: data
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <>
            <Head> <title> Ayq | student </title> </Head>
            <div> {state.email} </div>
            <button onClick={() => signOut()}>Logout</button>
        </>
    );
}
