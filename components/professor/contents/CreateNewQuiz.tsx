import useProfessorState, { ProfessorStateType } from 'state_providers/professor';
import React, { useState } from 'react';
import { ActionIcon, Badge, Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import AddQuestions from './AddQuestions';
import { IconX } from '@tabler/icons';

export default function CreateNewQuiz({ onSaveSuccess }: { onSaveSuccess: Function; }) {
    const { state, dispatch }: ProfessorStateType = useProfessorState();
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [forSections, setForSections] = useState<string[]>([]);

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

            <Paper p='sm' radius={7} withBorder>
                <Group align='flex-start'>
                    <Text color='dimmed' mb='sm'> Title: </Text>
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
            </Paper>

            {forSections.length > 0 && <AddQuestions onSaveSuccess={onSaveSuccess} quizTitle={quizTitle} forSections={forSections} />}
        </Stack>
    );
}

const removeButton = (
    <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
        <IconX size={15} />
    </ActionIcon>
);