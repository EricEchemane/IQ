import { Avatar, Group, Stack, Title, Text, Button, Modal, useMantineTheme, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import { IStudentState } from 'state_providers/student';

export default function AppHeader({ data }: { data: IStudentState; }) {
    const theme = useMantineTheme();
    const router = useRouter();
    const [quizCodeInputModal, setQuizCodeInputModal] = useState(false);
    const [quizCode, setQuizCode] = useState('');

    return <>
        <Group align='center' position="apart" style={{ width: '100%' }}>
            <Group>
                <Avatar src={data.image} alt={`${data.name} profile`} radius={50} />
                <Stack spacing={0}>
                    <Title order={6}> {data.name} </Title>
                    <Text size={'sm'}> {data.email} </Text>
                </Stack>
            </Group>
            <Button onClick={() => setQuizCodeInputModal(true)}> Join a room </Button>
        </Group>

        <Modal
            withCloseButton={false}
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.55}
            overlayBlur={3}
            overflow='inside'
            closeOnEscape
            opened={quizCodeInputModal}
            onClose={() => setQuizCodeInputModal(false)}>

            <Stack>
                <Text weight='bold'> Enter the quiz code </Text>
                <Group>
                    <TextInput
                        autoFocus
                        style={{ flex: 1 }}
                        value={quizCode}
                        onChange={e => setQuizCode(e.target.value)}
                        placeholder="quiz code" />
                    <Button
                        onClick={() => {
                            if (quizCode.length !== 7) {
                                showNotification({
                                    message: 'Invalid quiz code',
                                    color: 'red'
                                });
                                return;
                            }
                        }}> Join </Button>
                </Group>
            </Stack>
        </Modal>
    </>;
}