import { Accordion, ActionIcon, Button, Dialog, Group, Menu, Modal, Paper, Stack, Text, TextInput, Title, useMantineTheme } from '@mantine/core';
import { IconTrash, IconDots, IconEdit, IconBookUpload, IconBookDownload, IconCheck } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import useProfessorState, { ProfessorActions, ProfessorStateType } from 'state_providers/professor';
import moment from 'moment';
import QuizView from './QuizView';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import QuizAdapter, { publishQuizPayload, updateQuizTitlePayload } from 'http_adapters/adapters/quiz.adapter';
import { showNotification } from '@mantine/notifications';

export default function ViewQuizes() {
    const theme = useMantineTheme();
    const { state, dispatch }: ProfessorStateType = useProfessorState();
    const [viewQuestionsModelIsOpen, setViewQuestionsModelIsOpen] = useState(false);
    const [editTitleModalIsOpen, setEditTitleModalIsOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<any>();
    const updateQuizTitleAdapter = useHttpAdapter<updateQuizTitlePayload>(QuizAdapter.updateTitle);
    const publishQuizAdapter = useHttpAdapter<publishQuizPayload>(QuizAdapter.publish);

    useEffect(() => {
        if (updateQuizTitleAdapter.data) {
            showNotification({
                message: 'Updated successfully',
                color: 'green',
                icon: <IconCheck />
            });
            setEditTitleModalIsOpen(false);
            dispatch({
                type: ProfessorActions.update_quiz_title,
                payload: {
                    quizId: selectedQuiz._id,
                    title: selectedQuiz.title
                } as updateQuizTitlePayload
            });
        }
        if (updateQuizTitleAdapter.error) {
            showNotification({
                title: 'Ooops!',
                message: updateQuizTitleAdapter.error.message,
                color: 'red',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateQuizTitleAdapter.data, updateQuizTitleAdapter.error]);

    useEffect(() => {
        if (publishQuizAdapter.data && selectedQuiz) {
            showNotification({
                message: 'Quiz has been published',
                color: 'green',
                icon: <IconCheck />
            });
            dispatch({
                type: ProfessorActions.publish_quiz,
                payload: { quizId: selectedQuiz._id } as publishQuizPayload
            });
        }
        if (publishQuizAdapter.error) {
            showNotification({
                title: 'Ooops!',
                message: publishQuizAdapter.error.message,
                color: 'red',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publishQuizAdapter.data, publishQuizAdapter.error]);

    const openQuestionsModal = (index: number) => {
        setSelectedQuiz(state.quizes[index]);
        setViewQuestionsModelIsOpen(true);
    };
    const saveTitle = () => {
        updateQuizTitleAdapter.execute({
            quizId: selectedQuiz._id,
            title: selectedQuiz.title
        });
    };
    const publish = (quizId: string) => {
        publishQuizAdapter.execute({ quizId });
    };

    return (
        <>
            <Stack>
                <Title order={4}> Your Quizzes </Title>

                {state.quizes.map((quiz: any, index) => (
                    <Paper key={index} py='xs' px='md' shadow='xs'>
                        <Group align='flex-start'>
                            <Stack style={{ flex: 1 }}>
                                <Title order={5}> {quiz.title} </Title>
                                <Group>
                                    <Text size='sm'> Created on {moment(quiz.date_created).format('LL')} </Text>
                                    <Button
                                        onClick={() => openQuestionsModal(index)}
                                        variant='subtle'
                                        size='sm'> {quiz.questions.length} questions </Button>
                                </Group>
                            </Stack>

                            <Menu shadow="md" width={200} position='bottom-end' offset={0} withArrow>
                                <Menu.Target>
                                    <ActionIcon radius={50} size={30}>
                                        <IconDots />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>Quiz options</Menu.Label>
                                    <Menu.Item
                                        onClick={() => {
                                            setSelectedQuiz(quiz);
                                            setEditTitleModalIsOpen(true);
                                        }}
                                        icon={<IconEdit size={14} />}> Edit title </Menu.Item>
                                    {quiz.published
                                        ? <Menu.Item icon={<IconBookDownload size={14} />}> Unpublish </Menu.Item>
                                        : <Menu.Item
                                            onClick={() => {
                                                setSelectedQuiz(quiz);
                                                publish(quiz._id);
                                            }}
                                            icon={<IconBookUpload size={14} />}> Publish this quiz </Menu.Item>}

                                    <Menu.Divider />

                                    <Menu.Label>Danger zone</Menu.Label>
                                    <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete this quiz</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Paper>
                ))}
            </Stack>

            <Modal
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                overflow='inside'
                closeOnEscape
                opened={viewQuestionsModelIsOpen}
                onClose={() => setViewQuestionsModelIsOpen(false)}
                title={<Text weight='bold' color='dimmed'> {selectedQuiz?.title} | Questions </Text>}
            >
                <Accordion>
                    {selectedQuiz?.questions.map((question: any, index: number) => (
                        <QuizView quizId={selectedQuiz._id} key={index} index={index} question={question} />
                    ))}
                </Accordion>
            </Modal>

            <Dialog
                opened={editTitleModalIsOpen}
                withCloseButton
                onClose={() => setEditTitleModalIsOpen(false)}
                size="lg"
                radius="md"
            >
                <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
                    Edit quiz title
                </Text>
                <Group align="flex-end">
                    <TextInput
                        value={selectedQuiz?.title}
                        placeholder="New quiz title"
                        onChange={e => {
                            setSelectedQuiz((quiz: any) => ({ ...quiz, title: e.target.value }));
                        }}
                        style={{ flex: 1 }} />
                    <Button
                        loading={updateQuizTitleAdapter.loading}
                        onClick={saveTitle}> Save </Button>
                </Group>
            </Dialog>
        </>
    );
}
