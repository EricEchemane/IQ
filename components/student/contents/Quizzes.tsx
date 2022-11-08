import { Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import moment from 'moment';
import React from 'react';

export default function Quizzes(props: {
    quizzes: any[];
}) {
    return <>
        <Title order={3}> Your Quizzes </Title>
        <Stack my='lg'>
            {props.quizzes?.length !== 0 && props.quizzes?.map((data: any, index) => (
                <Paper key={index} withBorder p='md'>
                    <Stack>
                        <Title order={4}> {data.quiz?.title} </Title>
                        <Stack spacing={0.5}>
                            <Text size={'sm'}> {data.quiz?.program} </Text>
                            <Text size={'sm'}> {data.quiz?.course} </Text>
                        </Stack>
                        <Group>
                            <Text> Final Score: {data.final_score} - Rank: {data.ranking} </Text>
                            <Divider orientation='vertical' />
                            <Text> Taken on: {moment(data.date_finished).format('LL')} </Text>
                        </Group>
                    </Stack>
                </Paper>
            ))}
            {props.quizzes?.length === 0 && <>
                <Text> You have not taken any quiz yet </Text>
            </>}
        </Stack>
    </>;
}
