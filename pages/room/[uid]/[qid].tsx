import {
    Avatar, Button, Container,
    CopyButton, Divider, Group,
    Loader, Paper, Stack, Text, Title
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconClipboard, IconClipboardCheck, IconRocket } from '@tabler/icons';
import connectToDatabase from 'db/connectToDatabase';
import { IQuiz } from 'entities/quiz.entity';
import { IUser } from 'entities/user.entity';
import { parseQuizId } from 'lib/quiz_helpers';
import { ClientSocket, QuizRoom } from 'lib/socket/types';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import io from "socket.io-client";

let socket: ClientSocket;

export default function QuizRoomComponent({ user, quiz }: {
    user: IUser;
    quiz: IQuiz & { _id: string; };
}) {
    const router = useRouter();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace('/signin');
        }
    });
    const [roomIsCreated, setRoomIsCreated] = useState(false);
    const [quizRoom, setQuizRoom] = useState<QuizRoom>();

    const socketInitializer = useCallback(async () => {
        await fetch("/api/room");
        socket = io();
        socket.on('connect', () => {
            console.info(`Client connect with id`, socket.id);
        });
        socket.on('disconnect', () => {
            console.info(socket.id, `disconnected`);
        });
        socket.on('participant:joined', (newQuizRoom: QuizRoom) => {
            setQuizRoom(newQuizRoom);
            const newParticipant = newQuizRoom.participants[newQuizRoom.participants.length - 1];
            showNotification({
                id: newParticipant.student.email,
                message: `${newParticipant.student.name} joined`,
            });
        });
        socket.on('participant:leave', (newQuizRoom: QuizRoom) => {
            setQuizRoom(newQuizRoom);
            console.log(newQuizRoom);
        });

        socket.emit('create:room', {
            room: parseQuizId(quiz._id),
            user, quiz
        }, (err: Error, quizRoom: QuizRoom) => {
            if (quizRoom) {
                setRoomIsCreated(true);
                setQuizRoom(quizRoom);
                console.info(quizRoom);
            }
            if (err) console.error(err.message);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cancelQuiz = () => {
        if (!quizRoom) return;
        socket.emit('destroy:room', quizRoom.room,
            (err: any, data: any) => {
                if (data) router.replace('/');
                else console.error(err.message);
            });
    };
    const startQuiz = () => {
        if (!quizRoom) return;
        const startConfirmed = confirm('Are you sure to start the quiz?');
        if (!startConfirmed) return;
        socket.emit('start:quiz', quizRoom.room, (error: string, data: QuizRoom) => {
            if (data) {
                setQuizRoom(data);
            }
            if (error) console.error(error);
        });
    };

    useEffect(() => {
        socketInitializer();
    }, [socketInitializer]);

    return <>
        <Head> <title> Quiz Room - IQ </title> </Head>

        {/* HEADER */}
        <Paper shadow={'sm'}>
            <Container p='sm'>
                <Group align={'center'} position='apart'>
                    <Group align={'center'}>
                        <Avatar src={user.image} alt={`profile of ${user.name}`} radius={50} />
                        <Stack spacing={0}>
                            <Title order={6}> Prof. {user.name} </Title>
                            <Text size='sm'> {user.email} </Text>
                        </Stack>
                    </Group>
                    <Group spacing={5}>
                        <Text color='dimmed'> Quiz Code: </Text>
                        <CopyButton value={parseQuizId(quiz._id)}>
                            {({ copied, copy }) => (
                                <Button
                                    rightIcon={copied ? <IconClipboardCheck /> : <IconClipboard />}
                                    radius={50}
                                    variant='subtle'
                                    color={copied ? 'teal' : 'blue'}
                                    onClick={copy}>
                                    {parseQuizId(quiz._id)}
                                </Button>
                            )}
                        </CopyButton>
                    </Group>
                </Group>
            </Container>
        </Paper>

        <Container p='md'>
            <Group align={'center'} position='apart' mt='sm'>
                <Stack spacing={6}>
                    <Title order={3}> {quiz.title} </Title>
                    <Group>
                        <Text>
                            {quizRoom?.participants.length}
                            {quizRoom?.participants.length === 1 ? ' Participant' : ' Participants'}
                        </Text>
                        <Divider size={'sm'} orientation='vertical' />
                        <Text> {quiz.questions.length} Questions </Text>
                        <Divider size={'sm'} orientation='vertical' />
                        <Text>
                            {roomIsCreated
                                ? <Text weight={'bold'} color={'green'}> Your room is active </Text>
                                : <Group>
                                    <Text color={'blue'}> Creating room </Text>
                                    <Loader variant='dots' />
                                </Group>}
                        </Text>
                    </Group>
                </Stack>

                <Button
                    onClick={startQuiz}
                    disabled={quizRoom?.participants.length === 0}
                    rightIcon={<IconRocket strokeWidth={1.5} />}
                    size='md'> Start </Button>
            </Group>

            {!quizRoom?.isStarted && <Stack align='center' p='md' mt='3rem'>
                <Loader size="xl" variant="bars" />
                <Text
                    align='center'
                    weight={'bold'}
                    size='xl'
                    color='dimmed'> Waiting for other participants to join </Text>
                <Button
                    onClick={cancelQuiz}
                    variant='light'
                    mt='xl'> Cancel and return home </Button>
            </Stack>}
        </Container>
    </>;
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { params } = context;
        if (!params) return redirectObject;

        const { uid, qid } = params;
        if (!uid || !qid) return redirectObject;

        const db = await connectToDatabase();
        if (!db) return redirectObject;

        const { User, Quiz } = db.models;

        const user = await User.findById(uid);
        if (!user) return redirectObject;
        if (user.type !== 'professor') return redirectObject;

        const quiz = await Quiz.findById(qid);
        if (!quiz) return redirectObject;

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                quiz: JSON.parse(JSON.stringify(quiz)),
            }
        };

    } catch (error) {
        return redirectObject;
    }
};

const redirectObject = {
    redirect: {
        permanent: false,
        destination: "/404",
    },
    props: {},
};