import { Paper, Title } from '@mantine/core';
import { IQuestion } from 'entities/question.entity';
import React from 'react';

export default function AddedQuestions({ questions }: { questions: IQuestion[]; }) {
    return (
        <>
            <Title order={6}> Questions </Title>
            <Paper p='md' shadow='md' mb='1rem'>

            </Paper>
        </>
    );
}
