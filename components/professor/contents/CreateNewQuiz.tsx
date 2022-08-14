import useProfessorState, { ProfessorStateType } from 'state_providers/professor';
import React, { useState } from 'react';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import QuizAdapter, { CreateQuizPayload } from 'http_adapters/adapters/quiz.adapter';
import { ActionIcon, Badge, Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import { IconX } from '@tabler/icons';

export default function CreateNewQuiz() {
    const { state, dispatch }: ProfessorStateType = useProfessorState();
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [forSections, setForSections] = useState<string[]>([]);
    const newQuizAdapter = useHttpAdapter<CreateQuizPayload>(QuizAdapter.createNew);

    const addSection = () => {
        if (section.trim().length <= 0) return;
        setForSections(sections => [...sections, section]);
        setSection('');
    };
    const removeSection = (section: string) => {
        setForSections(sections => sections.filter(s => s !== section));
    };

    return (
        <Stack>
            <Title order={4}> Create New Quiz </Title>

            <Paper p='sm' radius={7} shadow='sm'>
                <Text color='dimmed' mb='sm'>Title: {quizTitle} </Text>
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
            </Paper>

            <TextInput
                placeholder='enter your quiz title here'
                label='Quiz Title'
                required
                value={quizTitle}
                minLength={5}
                onChange={(event) => setQuizTitle(event.currentTarget.value)} />

            <Group align='flex-end'>
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
                <Button variant='filled' onClick={addSection}>Add</Button>
            </Group>
        </Stack>
    );
}

const removeButton = (
    <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
        <IconX size={15} />
    </ActionIcon>
);