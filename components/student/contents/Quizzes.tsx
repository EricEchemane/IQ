import { Button, Divider, Group, Modal, Paper, Stack, Text, Title } from '@mantine/core';
import moment from 'moment';
import React, { useState } from 'react';

interface SelectedQuiz {
    title: string;
    answers: string[];
    questions: {
        choices: string[];
        correct_choice: string;
        question: string;
    }[];
}

export default function Quizzes(props: {
    quizzes: any[];
}) {
    const [selectedQuiz, setSelectedQuiz] = useState<SelectedQuiz | undefined>();

    return <>
        <Title order={3}> Your Quizzes </Title>
        <Stack my='lg'>
            {props.quizzes?.length !== 0 && props.quizzes?.map((data: any, index) => (
                <Paper key={index} withBorder p='md'>
                    <Stack>
                        <Title order={4}> {data.quiz?.title} </Title>
                        <Stack spacing={0.5}>
                            <Text size={'sm'}> {data.quiz?.program} </Text>
                            <Text size={'sm'}> {data.quiz?.course} </Text>
                        </Stack>
                        <Group>
                            <Text> Final Score: {data.final_score} - Rank: {data.ranking} </Text>
                            <Divider orientation='vertical' />
                            <Text> Taken on: {moment(data.date_finished).format('LL')} </Text>
                            <Divider orientation='vertical' />
                            <Button
                                onClick={() => setSelectedQuiz({
                                    answers: data.answers,
                                    questions: data.quiz.questions,
                                    question: data.quiz.question,
                                    title: data.quiz.title,
                                } as any)}
                                variant='light'>
                                my answers
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            ))}
            {props.quizzes?.length === 0 && <>
                <Text> You have not taken any quiz yet </Text>
            </>}
        </Stack>

        <Modal
            size={'lg'}
            opened={!!selectedQuiz}
            onClose={() => setSelectedQuiz(undefined)}
            title={"Your answers in " + selectedQuiz?.title}
        >
            {
                selectedQuiz?.questions.map((q, index) => {
                    const isCorrect = q.correct_choice === selectedQuiz.answers[index];
                    return <QuizItemAnswer
                        itemNumber={index + 1}
                        correct_answer={q.correct_choice}
                        answer={selectedQuiz.answers[index]}
                        question={q.question}
                        key={index}
                        isCorrect={isCorrect} />;
                })
            }
        </Modal>
    </>;
}

type QuizItemAnswerProps = {
    isCorrect: boolean;
    question: string;
    answer: string;
    correct_answer: string;
    itemNumber: number;
};

const QuizItemAnswer = ({
    isCorrect,
    answer,
    correct_answer,
    question,
    itemNumber
}: QuizItemAnswerProps) => {
    return <>
        <Stack mb={'xl'}>
            <Title order={4}> {itemNumber}. {question} </Title>
            <Text>
                You answered: <b> {answer} </b> {isCorrect && '✅correct'}
            </Text>
            <Text>
                {!isCorrect && '❌wrong, the correct answer is ' + correct_answer}
            </Text>
        </Stack>
        <Divider />
    </>;
};
