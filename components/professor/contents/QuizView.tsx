import { Accordion, Button, Group, NumberInput, Switch, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IQuestion } from 'entities/question.entity';
import React, { useState } from 'react';

export default function QuizViewEditMode({ question, index }: { question: IQuestion; index: number; }) {
    const [isInEditMode, setIsInEditMode] = useState(false);
    const editForm = useForm({
        initialValues: {
            question: question.question,
            choices: question.choices,
            correct_choice: question.correct_choice,
            points: question.points,
            timer: question.timer
        }
    });

    return (
        <>
            {!isInEditMode ?

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
                            <Switch
                                checked={isInEditMode}
                                onChange={(event) => setIsInEditMode(event.currentTarget.checked)}
                                size='sm' />
                            <Text size={'sm'}> Turn on edit mode </Text>
                        </Group>
                    </Accordion.Panel>
                </Accordion.Item>

                : // EDIT MODE
                <form>
                    <Accordion.Item value={editForm.values.question}>
                        <Accordion.Control>
                            <Title color='blue' order={6}> {`Edit question no. ${index + 1}`} </Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <TextInput
                                mb='md'
                                label='Question'
                                placeholder='question'
                                {...editForm.getInputProps('question')}
                            />
                            {question.choices.map((c: any) => (
                                <Text key={c} color={c === question.correct_choice ? 'green' : 'dark'}> {c} </Text>
                            ))}
                            <Group my='md'>
                                <NumberInput
                                    label='Timer'
                                    min={5}
                                    style={{ width: '100px' }}
                                    {...editForm.getInputProps('timer')}
                                />
                                <NumberInput
                                    label='Points'
                                    min={1}
                                    style={{ width: '100px' }}
                                    {...editForm.getInputProps('points')}
                                />
                            </Group>

                            <Group position='left' align='center' mt='1rem'>
                                <Switch
                                    checked={isInEditMode}
                                    onChange={(event) => setIsInEditMode(event.currentTarget.checked)}
                                    size='sm' />
                                <Text size={'sm'}> Turn off edit mode </Text>
                            </Group>

                            <Group position='right' mt='md'>
                                <Button type='submit'> Save </Button>
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                </form>}
        </>
    );
}