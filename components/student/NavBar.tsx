import { Stack, Text, Title } from '@mantine/core';
import React from 'react';

interface Props {
    course: string;
    section: string;
    year: string;
}

export default function NavBar({ course, section, year }: Props) {
    course = course.split(' | ')[1];
    return (
        <Stack>
            <Stack spacing={0}>
                <Title order={6}> Course and section </Title>
                <Text> {course.toUpperCase() + ' ' + year + section.toUpperCase()} </Text>
            </Stack>
        </Stack>
    );
}
