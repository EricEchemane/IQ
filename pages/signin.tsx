import { Button, Stack, Title } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
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
            <Head> <title> Sign in - Ayq </title> </Head>
            <Stack sx={{ maxWidth: 300 }} mx="auto" my='4rem'>
                <Title align='center' order={4}> Sign in </Title>
                <Button
                    onClick={() => signIn('google')}
                    size='xl'
                    variant='light'
                    leftIcon={<IconBrandGoogle />}>
                    Continue with Google
                </Button>
            </Stack>
        </>
    );
}
