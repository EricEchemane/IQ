import { ActionIcon, Badge, Button, Group, NumberInput, Paper, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconPlus, IconX } from '@tabler/icons';
import { IQuestion } from 'entities/question.entity';
import React, { useState } from 'react';
import AddedQuestions from './AddedQuestions';

export default function AddQuestions({ quizTitle, forSections }: {
    quizTitle: string;
    forSections: string[];
}) {
    const [questions, setQuestions] = useState<IQuestion[]>([]);

    const form = useForm({
        initialValues: {
            question: '',
            timer: 5,
            choices: ['option 1 (edit me)', 'option 2 (edit me)'],
            correct_choice: '',
            points: 1,
        },
        validate: {
            question: question => question.trim().length < 5 ? 'Question must be at least 5 characters long' : null,
            choices: choices => choices.length < 2 ? 'Requires atleast two choices' : null,
            correct_choice: (correct_choice, values) => {
                if (!correct_choice) return 'Every question should have the correct answer';
                const correctChoiceIsInTheChoices = values.choices.find(choice => choice === correct_choice);
                if (!correctChoiceIsInTheChoices) return 'Answer key should be in the given choices';
            }
        }
    });
    const addQuestion = () => {
        setQuestions(q => {
            return [...q, form.values];
        });
        form.reset();
    };
    const save = () => {
        console.log('save');
    };

    return (
        <Stack mt='1rem'>

            <Title order={6}> Add Questions </Title>
            <Paper p='md' shadow='md'>
                <form onSubmit={form.onSubmit(addQuestion)}>
                    <Stack>
                        <Textarea
                            style={{ flex: 1 }}
                            required
                            minLength={5}
                            label='New question'
                            placeholder='enter your question here'
                            {...form.getInputProps('question')}
                        />

                        <Group>
                            <NumberInput
                                {...form.getInputProps('timer')}
                                style={{ width: '100px' }}
                                min={1}
                                label='Timer'
                                placeholder='5' />
                            <NumberInput
                                {...form.getInputProps('points')}
                                style={{ width: '100px' }}
                                min={1}
                                label='Points'
                                placeholder='1' />
                        </Group>

                        <Stack spacing={8} mt='1rem'>
                            <Group>
                                <Text size='sm' weight='bold'> Answer key: </Text>
                                <Badge size='lg' color={form.values.correct_choice ? 'blue' : 'yellow'}>
                                    {form.values.correct_choice || 'check one of the options below'}
                                </Badge>
                            </Group>

                            {form.values.choices.map((choice, index) => (
                                <Group key={index}>
                                    <TextInput
                                        style={{ flex: 1 }}
                                        value={choice}
                                        onChange={event => {
                                            const copy = [...form.values.choices];
                                            copy[index] = event.target.value;
                                            form.setFieldValue('choices', copy);
                                        }} />

                                    <ActionIcon
                                        onClick={() => {
                                            form.setFieldValue('correct_choice', choice);
                                        }}
                                        size={20}
                                        variant={form.values.correct_choice === choice ? 'filled' : 'light'}
                                        color='green'>
                                        <IconCheck />
                                    </ActionIcon>

                                    <ActionIcon
                                        onClick={() => {
                                            if (form.values.choices.length === 2) return;
                                            if (form.values.correct_choice === choice) {
                                                form.setFieldValue('correct_choice', '');
                                            }
                                            form.setFieldValue(
                                                'choices',
                                                form.values.choices.filter((_, idx) => idx !== index)
                                            );
                                        }}
                                        disabled={form.values.choices.length === 2}
                                        size={20}
                                        radius={0}
                                        variant='light'>
                                        <IconX />
                                    </ActionIcon>

                                </Group>
                            ))}

                            <Stack mt='md' align='center' spacing={2}>

                                <ActionIcon
                                    onClick={() => {
                                        if (form.values.choices.length === 4) return;
                                        form.setFieldValue(
                                            'choices',
                                            [...form.values.choices, `option ${form.values.choices.length + 1} (edit me)`]
                                        );
                                    }}
                                    disabled={form.values.choices.length === 4}
                                    size={30}
                                    variant='filled'
                                    color={'blue'}
                                    radius={50}>
                                    <IconPlus />
                                </ActionIcon>

                                <Text color='dimmed'>
                                    {form.values.choices.length === 4 ? 'Maximum of 4 choices' : 'Add another choice'}
                                </Text>

                            </Stack>
                        </Stack>
                    </Stack>

                    <Group grow mt='2rem'>
                        <Button
                            disabled={form.values.correct_choice === ''}
                            variant='light'
                            type='submit'> Add this question </Button>
                    </Group>
                </form>
            </Paper>

            {questions.length !== 0 && <AddedQuestions questions={questions} />}

            <Group position='right' mt='md' grow>
                <Button disabled={!quizTitle || !questions.length} onClick={save}> SAVE THIS QUIZ </Button>
            </Group>
        </Stack>
    );
}
