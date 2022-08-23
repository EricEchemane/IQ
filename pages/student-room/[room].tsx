import {
    Avatar, Badge, Button, Container,
    Divider, Group, Indicator, Loader,
    Modal, Paper, Radio, Stack, Text, Title, useMantineTheme
} from '@mantine/core';
import { IconClock } from '@tabler/icons';
import connectToDatabase from 'db/connectToDatabase';
import { IUser } from 'entities/user.entity';
import { QuizRoom } from 'lib/socket/quizRoom';
import { ClientSocket, participant } from 'lib/socket/types';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import io from "socket.io-client";

let socket: ClientSocket;
let outsideAnswer = '';

export default function StudentRoom({ user }: { user: IUser; }) {
    const theme = useMantineTheme();
    const router = useRouter();
    const { room } = router.query;
    const [connected, setConnected] = useState(false);
    const [quizRoom, setQuizRoom] = useState<QuizRoom>();
    const [currentTimer, setCurrentTimer] = useState(0);
    const [answer, setAnswer] = useState('');
    const [answerStatus, setAnswerStatus] = useState<'unchecked' | 'correct' | 'wrong'>('unchecked');

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
        socket.on('quiz:started', (quizRoom: QuizRoom) => {
            setQuizRoom(quizRoom);
            console.log(quizRoom);
        });
        socket.on('quiz:stopped', (quizRoom: QuizRoom) => {
            setQuizRoom(quizRoom);
            alert('The host stopped the quiz');
        });
        socket.on('timer:changed', count => {
            setCurrentTimer(count);
        });
        socket.on('question:next', (quizRoom: QuizRoom) => {
            setQuizRoom(quizRoom);
            setAnswerStatus('unchecked');
            setAnswer('');
        });
        socket.on('reveal:correct-answer', (correctAnswer: string) => {
            const answerIsCorrect = correctAnswer === outsideAnswer;
            if (answerIsCorrect) setAnswerStatus('correct');
            else setAnswerStatus('wrong');
        });

        // join room
        if (typeof room === 'string') {
            socket.emit('join:room', { room, user }, (error: string, data: {
                participant: participant,
                quizRoom: QuizRoom;
            }) => {
                if (error) {
                    console.error(error);
                    alert('This room is not yet created. Please check the code or ask your professor');
                    router.replace('/');
                }
                if (data) {
                    setConnected(true);
                    setQuizRoom(data.quizRoom);
                    console.log(data);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        outsideAnswer = answer;
    }, [answer]);

    useEffect(() => {
        socketInitializer();
        if (!socket) return;
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('participant:joined');
            socket.off('participant:leave');
            socket.off('quiz:started');
            socket.off('quiz:stopped');
            socket.off('room:destroyed');
            socket.off('timer:changed');
            socket.off('reveal:correct-answer');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        <Button variant='subtle' onClick={leave}> Leave </Button>
                    </Group>
                </Group>
            </Container>
        </Paper>

        <Container p='sm'>
            {!quizRoom?.isStarted && <Stack align='center'>
                <Text
                    mt='4rem'
                    style={{ fontSize: '2.5rem' }}
                    color={connected ? 'green' : 'yellow'}
                    weight='bold'> {connected ? "You're in" : "Connecting to"} </Text>
                <Badge> Room {room} </Badge>
                {connected && <Text color='dimmed' mt='xl'> The host will start the quiz soon </Text>}
                <Loader variant='dots' />
            </Stack>}

            {quizRoom?.isStarted && <>
                <Paper mt='md' p='md' mb='md' withBorder radius={10}>
                    <Group position='apart'>
                        <Group align='center'>
                            <IconClock size={35} style={{ transform: 'translateY(2px)' }} />
                            <Title color='dimmed'> {currentTimer} </Title>
                        </Group>
                        <Badge> {quizRoom?.currentIndexOfQuestion + 1} of {quizRoom.quiz.questions.length} </Badge>
                    </Group>
                    <Radio.Group
                        mt='md'
                        value={answer}
                        onChange={setAnswer}
                        orientation="vertical"
                        label={quizRoom?.currentQuestion?.question}
                        offset="md"
                        size="md"
                    >
                        {quizRoom.currentQuestion?.choices.map((choice: string, index: number) => (
                            <Radio value={choice} label={choice} key={index} />
                        ))}
                    </Radio.Group>
                </Paper>
            </>}
        </Container>

        <Modal
            withCloseButton={false}
            onClose={() => { }}
            size={'550px'}
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.55}
            overlayBlur={3}
            overflow='inside'
            opened={answerStatus !== 'unchecked'}
            title={<Text weight='bold' color='dimmed'> Your answer is... </Text>}
        >
            {answerStatus === 'correct' && <>
                <Text size={'xl'} color='green'> Correct! </Text>
            </>}
            {answerStatus === 'wrong' && <>
                <Text size={'xl'} color='red'> Wrong </Text>
                <Text color='dimmed'> The correct answer is {quizRoom?.currentQuestion?.correct_choice} </Text>
            </>}
        </Modal>
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