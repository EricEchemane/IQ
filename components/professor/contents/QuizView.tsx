import { Accordion, Group, Switch, Text, Title } from '@mantine/core';
import { IQuestion } from 'entities/question.entity';
import React from 'react';

export default function QuizViewEditMode({ question, index }: { question: IQuestion; index: number; }) {
    return (
        <>
            <Accordion.Item value={question.question}>
                <Accordion.Control>
                    <Title order={6}>
                        {index + 1}. {question.question}
                    </Title>
                </Accordion.Control>
                <Accordion.Panel>
                    {question.choices.map((c: any) => (
                        <Text key={c} color={c === question.correct_choice ? 'green' : 'dark'}> {c} </Text>
                    ))}
                    <Text color='dimmed' size='sm' mt='sm'>
                        {question.timer} seconds - {question.points} {question.points && question.points > 1 ? 'points' : 'point'}
                    </Text>
                    <Group position='left' align='center' mt='1rem'>
                        <Switch size='sm' label='Toggle edit mode' />
                    </Group>
                </Accordion.Panel>
            </Accordion.Item>
        </>
    );
}
