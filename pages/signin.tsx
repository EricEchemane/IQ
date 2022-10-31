import { Button, Group, Stack, Title } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
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
            <Stack sx={{ maxWidth: 700 }} mx="auto" my='4rem'>
                <Group position='center'>
                    <Image
                        width={100}
                        height={100}
                        src={'/favicon.png'}
                        alt='dfcamclp logo' />
                </Group>
                <Title order={2} align='center' mb={'md'}> Dr. Filemon C. Aguilar Memorial College Las Pinas </Title>
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
