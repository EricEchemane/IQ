import { ActionIcon, Button, Group, Menu, Paper, Stack, Text, Title } from '@mantine/core';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconDots, IconEdit, IconUpload, IconBookUpload } from '@tabler/icons';
import React from 'react';
import useProfessorState, { ProfessorStateType } from 'state_providers/professor';
import moment from 'moment';

export default function ViewQuizes() {
    const { state, dispatch }: ProfessorStateType = useProfessorState();

    return (
        <Stack>
            <Title order={4}> Your Quizzes </Title>
            {state.quizes.map((quiz: any, index) => (
                <Paper key={index} p='xs' shadow='xs'>
                    <Group>
                        <Group style={{ flex: 1 }}>
                            <Title order={5}> {quiz.title} </Title> -
                            <Text size='sm'> {quiz.questions.length} questions </Text> -
                            <Text size='sm'> Created on {moment(quiz.date_created).format('LL')} </Text>
                        </Group>

                        <Menu shadow="md" width={200} position='bottom-end' offset={0} withArrow>
                            <Menu.Target>
                                <ActionIcon radius={50} size={30}>
                                    <IconDots />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Quiz options</Menu.Label>
                                <Menu.Item icon={<IconEdit size={14} />}> Edit </Menu.Item>
                                {!quiz.published && <Menu.Item icon={<IconBookUpload size={14} />}> Publish this quiz </Menu.Item>}

                                <Menu.Divider />

                                <Menu.Label>Danger zone</Menu.Label>
                                <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete this quiz</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Paper>
            ))}
        </Stack>
    );
}
