import { Avatar, Button, CopyButton, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { IconClipboard, IconClipboardCheck, IconRocket } from '@tabler/icons';
import connectToDatabase from 'db/connectToDatabase';
import { IQuiz } from 'entities/quiz.entity';
import { IUser } from 'entities/user.entity';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const parseRoomId = (id: string) => id.slice(id.length - 6);

export default function QuizRoom({ user, quiz }: {
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
    const [participants, setParticipants] = useState<IUser[]>([]);

    const cancelQuiz = () => {
        router.replace('/');
    };

    return <>
        <Head> <title> Quiz Room - IQ </title> </Head>

        {/* HEADER */}
        <Paper p='sm' shadow={'sm'}>
            <Group align={'center'} position='apart'>
                <Group align={'center'}>
                    <Avatar src={user.image} alt={`profile of ${user.name}`} radius={50} />
                    <Stack spacing={0}>
                        <Title order={6}> {user.name} </Title>
                        <Text size='sm'> {user.email} </Text>
                    </Stack>
                </Group>
                <Group spacing={5}>
                    <Text color='dimmed'> Quiz Code: </Text>
                    <CopyButton value={parseRoomId(quiz._id)}>
                        {({ copied, copy }) => (
                            <Button
                                rightIcon={copied ? <IconClipboardCheck /> : <IconClipboard />}
                                radius={50}
                                variant='subtle'
                                color={copied ? 'teal' : 'blue'}
                                onClick={copy}>
                                {parseRoomId(quiz._id)}
                            </Button>
                        )}
                    </CopyButton>
                </Group>
            </Group>
        </Paper>

        <Group align={'center'} position='apart' mt='sm' p='md'>
            <Stack spacing={4}>
                <Title order={3}>
                    {quiz.title}
                </Title>
                <Text>
                    {participants.length} {participants.length === 1 ? 'Participant' : 'Participants'}
                </Text>
            </Stack>

            <Button
                disabled={participants.length === 0}
                rightIcon={<IconRocket strokeWidth={1.5} />}
                size='md'> Start </Button>
        </Group>

        <Stack align='center' p='md' mt='3rem'>
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
        </Stack>
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