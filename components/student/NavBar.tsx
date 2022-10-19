import { Stack, Text, Title } from '@mantine/core';
import React from 'react';

interface Props {
    program: string;
    section: string;
    year: string;
}

export default function NavBar({ program, section, year }: Props) {
    program = program.split(' | ')[1];
    return (
        <Stack>
            <Stack spacing={0}>
                <Title order={6}> Section </Title>
                <Text> {program?.toUpperCase() + ' ' + year + section.toUpperCase()} </Text>
            </Stack>
        </Stack>
    );
}
