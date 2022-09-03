import { ActionIcon, Badge, Button, Group, Paper, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import React, { useState } from 'react';
import AddQuestions from './AddQuestions';
import { IconX } from '@tabler/icons';
import { courses, sections, years } from 'pages/register';

export default function CreateNewQuiz({ onSaveSuccess }: { onSaveSuccess: Function; }) {
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [course, setCourse] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [forSections, setForSections] = useState<string[]>([]);

    const addSection = () => {
        if (section.trim().length <= 0) return;
        setForSections(sections => [...sections, `${course} ${year + section}`]);
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
                <Select
                    required
                    value={course}
                    onChange={(v: string) => setCourse(v)}
                    label="For course"
                    placeholder="Select course"
                    data={courses} />
                <Select
                    required
                    value={year}
                    onChange={(v: string) => setYear(v)}
                    label="For year"
                    placeholder="Select year"
                    data={years} />
                <Select
                    required
                    value={section}
                    onChange={(v: string) => setSection(v)}
                    label="For section"
                    placeholder="Select section"
                    data={sections} />
                <Button
                    variant='filled'
                    disabled={
                        course === '' ||
                        year === '' ||
                        section === ''
                    }
                    onClick={addSection}>
                    Add
                </Button>
            </Group>

            <Paper p='sm' radius={7} withBorder>
                <Group align='flex-start'>
                    <Text color='dimmed' mb='sm'> Title: </Text>
                    <Text weight='bold'> {quizTitle} </Text>
                </Group>
                <Text color='dimmed'>For: {forSections.map((section, index) => {
                    return <Badge
                        key={index}
                        ml='xs'
                        px='xs'
                        size='lg'
                        rightSection={removeButton}
                        onClick={() => removeSection(section)}>
                        {section} </Badge>;
                })} </Text>
            </Paper>

            {forSections.length > 0 &&
                quizTitle !== '' &&
                <AddQuestions onSaveSuccess={onSaveSuccess} quizTitle={quizTitle} forSections={forSections} />}
        </Stack>
    );
}

const removeButton = (
    <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
        <IconX size={15} />
    </ActionIcon>
);