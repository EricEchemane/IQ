import { Stack, Text, Title } from '@mantine/core';
import React from 'react';

interface Props {
    course: string;
    section: string;
}

export default function NavBar({ course, section }: Props) {
    return (
        <Stack>
            <Stack spacing={0}>
                <Title order={6}> Course and section </Title>
                <Text> {course.toUpperCase() + ' - ' + section.toUpperCase()} </Text>
            </Stack>
        </Stack>
    );
}
