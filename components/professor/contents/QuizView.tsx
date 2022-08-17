import { Accordion, ActionIcon, Button, Group, LoadingOverlay, NumberInput, Switch, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconPlus, IconX } from '@tabler/icons';
import { IQuestion } from 'entities/question.entity';
import QuizAdapter, { UpdateAQuestionPayload } from 'http_adapters/adapters/quiz.adapter';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import React, { useEffect, useState } from 'react';

export default function QuizViewEditMode({ question, index, quizId }
    : {
        question: IQuestion & { _id: string; };
        index: number;
        quizId: string;
    }) {
    const [isInEditMode, setIsInEditMode] = useState(false);
    const updateQuestionAdapter = useHttpAdapter<UpdateAQuestionPayload>(QuizAdapter.updateAQuestion);

    useEffect(() => {
        if (updateQuestionAdapter.data) {
            console.log(updateQuestionAdapter.data);
        }
    });

    const editForm = useForm({
        initialValues: {
            question: question.question,
            choices: question.choices,
            correct_choice: question.correct_choice,
            points: question.points,
            timer: question.timer
        }
    });
    const save = (values: typeof editForm.values) => {
        updateQuestionAdapter.execute({
            ...values,
            questionId: question._id,
            quizId
        });
    };

    return (
        <>
            <form onSubmit={editForm.onSubmit(save)} style={{ position: 'relative' }}>
                <LoadingOverlay visible={updateQuestionAdapter.loading} overlayBlur={2} />

                <Accordion.Item value={question.question}>

                    {!isInEditMode
                        ? <Accordion.Control>
                            <Title order={6}>
                                {index + 1}. {question.question}
                            </Title>
                        </Accordion.Control>
                        : <Accordion.Control>
                            <Title color='blue' order={6}> {`Edit question no. ${index + 1}`} </Title>
                        </Accordion.Control>}

                    <Accordion.Panel>
                        {!isInEditMode
                            ?
                            <>
                                {question.choices.map((c: any) => (
                                    <Text key={c} color={c === question.correct_choice ? 'green' : 'dark'}> {c} </Text>
                                ))}
                                <Text color='dimmed' size='sm' mt='sm'>
                                    {question.timer} seconds - {question.points} {question.points && question.points > 1 ? 'points' : 'point'}
                                </Text>
                            </>
                            :
                            <>
                                <TextInput
                                    mb='md'
                                    label='Question'
                                    placeholder='question'
                                    {...editForm.getInputProps('question')}
                                />

                                {editForm.values.choices.map((c: any, index: number) => (
                                    <Group key={index} mb='md' spacing={5} align='flex-end'>
                                        <TextInput
                                            style={{ flex: 1 }}
                                            value={c}
                                            size='xs'
                                            description={`Option ${index + 1} ${editForm.values.correct_choice === c ? ' - correct' : ''}`}
                                            onChange={e => {
                                                const choices = editForm.values.choices;
                                                choices[index] = e.target.value;
                                                editForm.setFieldValue('choices', choices);
                                            }}
                                        />
                                        <ActionIcon
                                            onClick={() => {
                                                editForm.setFieldValue('correct_choice', c);
                                            }}
                                            variant={editForm.values.correct_choice === c ? 'light' : 'subtle'}
                                            color="green">
                                            <IconCheck />
                                        </ActionIcon>

                                        <ActionIcon
                                            onClick={() => {
                                                if (editForm.values.choices.length === 2) return;
                                                const choices = editForm.values.choices.filter(ch => ch !== c);
                                                editForm.setFieldValue('choices', choices);
                                            }}
                                            disabled={editForm.values.choices.length === 2}
                                            variant='subtle'
                                            color="red">
                                            <IconX />
                                        </ActionIcon>
                                    </Group>
                                ))}
                                <Group position='right' mb='md' spacing={5} align='center'>
                                    <Text size='xs'> {editForm.values.choices.length === 4 ? 'Maximum of 4 options' : 'Add another option'} </Text>
                                    <ActionIcon
                                        onClick={() => {
                                            const choices = [...editForm.values.choices, `Options ${editForm.values.choices.length + 1}`];
                                            editForm.setFieldValue('choices', choices);
                                        }}
                                        disabled={editForm.values.choices.length === 4}
                                        variant='subtle'
                                        color="blue">
                                        <IconPlus />
                                    </ActionIcon>
                                </Group>

                                <Group mb='md'>
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
                            </>}

                        <Group position='apart' align='center' mt='1rem'>
                            <Group position='left' align='center' >
                                <Switch
                                    checked={isInEditMode}
                                    onChange={(event) => setIsInEditMode(event.currentTarget.checked)}
                                    size='sm' />
                                <Text size={'sm'}>
                                    {isInEditMode ? 'Turn off edit mode' : 'Turn on edit mode'}
                                </Text>
                            </Group>
                            {isInEditMode && <Button type='submit'> Save </Button>}
                        </Group>

                    </Accordion.Panel>
                </Accordion.Item>
            </form>
        </>
    );
}