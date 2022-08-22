import {
    Avatar, Badge, Button, Container,
    CopyButton, Divider, Group,
    Loader, Paper, Stack, Text, Title
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconArrowRight, IconClipboard, IconClipboardCheck, IconRocket } from '@tabler/icons';
import connectToDatabase from 'db/connectToDatabase';
import { IQuestion } from 'entities/question.entity';
import { IQuiz } from 'entities/quiz.entity';
import { IUser } from 'entities/user.entity';
import useCountDown from 'lib/hooks/useCountDown';
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
    const [noMoreQuestion, setNoMoreQuestion] = useState(false);
    const countDown = useCountDown({
        onCountDownEnd: () => { },
        onCounChange: (count: number) => {
            if (!quizRoom) return;
            socket.emit('timer:change', count, quizRoom.room);
        },
        seconds: quizRoom?.quiz.default_question_timer || 5
    });

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
                countDown.start();
            }
            if (error) console.error(error);
        });
    };
    const stopQuiz = () => {
        if (!quizRoom) return;
        const confirmStop = confirm('Are you sure you want to stop the running quiz?');
        if (!confirmStop) return;
        socket.emit('quiz:stop', quizRoom.room, (error: string, data: QuizRoom) => {
            if (data) { setQuizRoom(data); }
            if (error) console.error(error);
        });
    };
    const nextQuestion = () => {
        if (!quizRoom) return;
        socket.emit('next:question', quizRoom.room, (error: string, data: QuizRoom) => {
            if (error) {
                console.log(error);
                return;
            }
            if (data) {
                if (data.currentIndexOfQuestion + 1 === data.quiz.questions.length) {
                    setNoMoreQuestion(true);
                }
                setQuizRoom(data);
                countDown.start();
            }
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

                {!quizRoom?.isStarted && <Button
                    onClick={startQuiz}
                    disabled={quizRoom?.participants.length === 0}
                    rightIcon={<IconRocket strokeWidth={1.5} />}
                    size='md'> Start </Button>}
                {quizRoom?.isStarted && <Button
                    onClick={stopQuiz}
                    variant='light'
                    color='red'
                    size='md'> Stop the quiz </Button>}
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

            {quizRoom?.isStarted && <Paper shadow='md' mt='md' p='md' withBorder radius={10}>
                <Badge> {quizRoom?.currentIndexOfQuestion + 1} of {quizRoom.quiz.questions.length} </Badge>
                <Stack align='center' mt='xl'>
                    <Title> {quizRoom?.currentQuestion?.question} </Title>
                    <Title color='dimmed'> {countDown.currentCount} </Title>
                </Stack>
                <Group position='right' mt='xl'>
                    {!noMoreQuestion && <Button
                        onClick={nextQuestion}
                        disabled={!countDown.finished}
                        variant='subtle'
                        rightIcon={<IconArrowRight strokeWidth={1.5} />}
                        size='md'> Next question </Button>}
                </Group>
            </Paper>}
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