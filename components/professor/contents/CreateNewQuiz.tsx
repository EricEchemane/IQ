import useProfessorState, { ProfessorStateType } from 'state_providers/professor';
import React, { useEffect, useState } from 'react';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import QuizAdapter, { CreateQuizPayload } from 'http_adapters/adapters/quiz.adapter';
import { ActionIcon, Badge, Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';

export default function CreateNewQuiz() {
    const { state, dispatch }: ProfessorStateType = useProfessorState();
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [forSections, setForSections] = useState<string[]>([]);
    const newQuizAdapter = useHttpAdapter<CreateQuizPayload>(QuizAdapter.createNew);

    useEffect(() => {
        if (newQuizAdapter.error) {
            showNotification({
                message: newQuizAdapter.error.message,
                title: 'Ooops!',
                color: 'red'
            });
        }
        if (newQuizAdapter.data) {
            console.log(newQuizAdapter.data);

            showNotification({
                message: 'Successfully created. Please continue',
                title: 'Great!',
                color: 'green',
                icon: <IconCheck />
            });
        }
    }, [newQuizAdapter.data, newQuizAdapter.error]);

    const addSection = () => {
        if (section.trim().length <= 0) return;
        setForSections(sections => [...sections, section]);
        setSection('');
    };
    const removeSection = (section: string) => {
        setForSections(sections => sections.filter(s => s !== section));
    };
    const createNew = () => {
        if (quizTitle.trim().length < 5) {
            showNotification({
                title: 'Ooops!',
                message: 'Title must be at least 5 characters long',
                color: 'red'
            });
            return;
        }
        const payload: CreateQuizPayload = { forSections, title: quizTitle };
        newQuizAdapter.execute(payload);
    };

    return (
        <Stack>
            <Title order={4}> Create New Quiz </Title>

            <TextInput
                placeholder='enter your quiz title here'
                label='Quiz Title'
                required
                value={quizTitle}
                minLength={5}
                onChange={(event) => setQuizTitle(event.currentTarget.value)} />

            <Group align='flex-end' spacing={5}>
                <TextInput
                    placeholder='enter sections here'
                    label='For Sections'
                    style={{ flex: 1 }}
                    value={section}
                    required
                    onChange={(event) => setSection(event.currentTarget.value)}
                    onKeyDown={getHotkeyHandler([
                        ['enter', addSection]
                    ])}
                />
                <Button variant='filled' disabled={section.trim().length === 0} onClick={addSection}>Add</Button>
            </Group>

            <Paper p='sm' radius={7} shadow='sm'>
                <Group align='flex-start'>
                    <Text color='dimmed' mb='sm'>Title: </Text>
                    <Text weight='bold'> {quizTitle} </Text>
                </Group>
                <Text color='dimmed'>For Sections: {forSections.map((section, index) => {
                    return <Badge
                        key={index}
                        ml='xs'
                        px='xs'
                        size='lg'
                        rightSection={removeButton}
                        onClick={() => removeSection(section)}
                    > {section} </Badge>;
                })} </Text>

                <Group position='right'>
                    <Button
                        loading={newQuizAdapter.loading}
                        onClick={createNew}
                        disabled={quizTitle.trim().length <= 0 || forSections.length === 0}
                        variant='light'> Continue </Button>
                </Group>
            </Paper>
        </Stack>
    );
}

const removeButton = (
    <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
        <IconX size={15} />
    </ActionIcon>
);