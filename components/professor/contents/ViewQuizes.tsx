import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import useProfessorState, { ProfessorStateType } from 'state_providers/professor';

export default function ViewQuizes() {
    const { state, dispatch }: ProfessorStateType = useProfessorState();

    return (
        <Stack>
            <Title order={4}> Your Quizzes </Title>
            {state.quizes.map((quiz: any, index) => (
                <Paper key={index} p='xs' shadow='xs'>
                    <Group>
                        <Title order={5}> {quiz.title} </Title> -
                        <Text> {quiz.questions.length} questions </Text>
                    </Group>
                </Paper>
            ))}
        </Stack>
    );
}
