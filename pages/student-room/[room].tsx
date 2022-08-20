import { Avatar, Button, Container, Divider, Group, Indicator, Paper, Stack, Text, Title } from '@mantine/core';
import connectToDatabase from 'db/connectToDatabase';
import { IUser } from 'entities/user.entity';
import { ClientSocket, QuizRoom } from 'lib/socket/types';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import io from "socket.io-client";

let socket: ClientSocket;

export default function StudentRoom({ user }: { user: IUser; }) {
    const router = useRouter();
    const { room } = router.query;
    const [connected, setConnected] = useState(false);

    const socketInitializer = useCallback(async () => {
        await fetch("/api/room");
        socket = io();

        socket.on('connect', () => {
            console.info(`Client connect with id`, socket.id);
        });
        socket.on('disconnect', () => {
            console.info(socket.id, `disconnected`);
        });
        socket.on('room:destroyed', (_room: string) => {
            if (_room !== room) return;
            alert('This room has been destroyed by the host. You will be redirected to the home page');
            router.replace('/');
        });

        if (typeof room !== 'string') return;
        socket.emit('join:room', { room, user }, (err: any, data: QuizRoom) => {
            if (err) console.error(err.message);
            if (data) {
                setConnected(true);
                console.log(data);
            }
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socketInitializer();
    }, [socketInitializer]);

    const leave = () => {
        const userWantsToLeave = confirm('Are you sure you want to leave this quiz room?');
        if (userWantsToLeave) {
            socket.disconnect();
            router.replace('/');
        }
    };

    return <>
        <Head> <title> Student Room | IQ </title> </Head>

        <Paper shadow={'sm'}>
            <Container p='sm'>
                <Group align={'center'} position='apart'>
                    <Group align={'center'}>
                        {connected
                            ? <Indicator color="green" size={15} withBorder>
                                <Avatar src={user.image} alt={`profile of ${user.name}`} radius={10} />
                            </Indicator>
                            : <Avatar src={user.image} alt={`profile of ${user.name}`} radius={10} />}
                        <Stack spacing={0}>
                            <Title order={6}> {user.name} </Title>
                            <Group>
                                <Text size='sm'> {user.email} </Text>
                                <Divider orientation='vertical' />
                                <Text size='sm'>
                                    {user.course.toUpperCase()} {user.section.toUpperCase()}
                                </Text>
                            </Group>
                        </Stack>
                    </Group>
                    <Group spacing={5} align='center'>
                        {/* <Text color='blue' weight='bold'> {room} </Text> */}
                        <Button variant='subtle' onClick={leave}> Leave </Button>
                    </Group>
                </Group>
            </Container>
        </Paper>
    </>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const token = await getToken({ req: context.req });
        const db = await connectToDatabase();

        const user: any = await db?.models.User.findOne({ email: token?.email });
        if (!user) return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        };

        if (user.type !== 'student') return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        };

        return {
            props: { user: JSON.parse(JSON.stringify(user)) }
        };
    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        };
    }
};