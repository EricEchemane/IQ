import { Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import moment from 'moment';
import React from 'react';

export default function Quizzes(props: {
    quizzes: any[];
}) {
    return <>
        <Title order={3}> Your Quizzes </Title>
        <Stack my='lg'>
            {props.quizzes?.map((data: any, index) => (
                <Paper key={index} withBorder p='md'>
                    <Stack>
                        <Title order={4}> {data.quiz?.title} </Title>
                        <Group>
                            <Text> Final Score: {data.final_score} </Text>
                            <Divider orientation='vertical' />
                            <Text> Taken on: {moment(data.date_finished).format('LL')} </Text>
                        </Group>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    </>;
}
