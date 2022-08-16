import { Accordion, Paper, Text, Title } from '@mantine/core';
import { IQuestion } from 'entities/question.entity';
import React from 'react';

export default function AddedQuestions({ questions }: { questions: IQuestion[]; }) {
    return (
        <>
            <Title order={6}> Questions </Title>
            <Paper shadow='md'>
                <Accordion>
                    {questions.map(({ choices, correct_choice, question, timer, points }, index) => (
                        <Accordion.Item value={question} key={index}>
                            <Accordion.Control>
                                <Title order={6}>{question}</Title>
                            </Accordion.Control>
                            <Accordion.Panel>
                                {choices.map(c => (
                                    <Text key={c} color={c === correct_choice ? 'green' : 'dark'}> {c} </Text>
                                ))}
                                <Text color='dimmed' size='sm' mt='sm'>
                                    {timer} seconds - {points} {points && points > 1 ? 'points' : 'point'}
                                </Text>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Paper>
        </>
    );
}
