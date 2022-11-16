import useUserState, { UserActions, UserStateType } from 'state_providers/student';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
    Group,
    Button,
    Tabs,
    Stack,
    TextInput,
    Modal,
} from '@mantine/core';
import AppHeader from './student/AppHeader';
import NavBar from './student/NavBar';
import { IconBallpen, IconUserCircle } from '@tabler/icons';
import Contents from './student/Contents';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import UserAdapter from 'http_adapters/adapters/user.adapter';
import useHttpAdapter from 'http_adapters/useHttpAdapter';

export default function Student({ data }: any) {
    const router = useRouter();
    const { dispatch, state }: UserStateType = useUserState();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>('quizes');
    const [quizCodeInputModal, setQuizCodeInputModal] = useState(false);
    const [quizCode, setQuizCode] = useState('');
    const deleteAccountAdapter = useHttpAdapter(UserAdapter.deleteAccount);

    const deleteAccount = async () => {
        const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone. Click cancel if you change your mind");
        if (confirmed) {
            const data = await deleteAccountAdapter.execute();
            if (data) signOut();
        }
    };

    useEffect(() => {
        dispatch({
            type: UserActions.set_user,
            payload: data
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return <>
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                    <NavBar {...state} />

                    <Tabs
                        mt={'lg'}
                        value={activeTab}
                        onTabChange={val => {
                            setActiveTab(val);
                            setOpened(false);
                        }}
                        orientation='vertical'>
                        <Tabs.List style={{ width: '100%' }}>
                            <Tabs.Tab
                                icon={<IconBallpen strokeWidth={1} />}
                                value="quizes"> Quizzes </Tabs.Tab>
                            <Tabs.Tab
                                icon={<IconUserCircle strokeWidth={1} />}
                                value="account"> Edit account </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                    {/* <Button
                        style={{ marginTop: 'auto' }}
                        mt={'1rem'}
                        color="red"
                        variant='subtle'
                        onClick={deleteAccount}> Delete my account </Button> */}
                </Navbar>
            }
            // aside={
            //     <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            //         <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            //             <Text>Application sidebar</Text>
            //         </Aside>
            //     </MediaQuery>
            // }
            footer={
                <Footer height={60} p="md">
                    <Group position='right'>
                        <Button variant='subtle' onClick={() => signOut()}> Sign out </Button>
                        <Button onClick={() => setQuizCodeInputModal(true)}> Join a room </Button>
                    </Group>
                </Footer>
            }
            header={
                <Header height={70} p="md">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>

                        <AppHeader data={state} />
                    </div>
                </Header>
            }
        >
            <Contents activeTab={activeTab} />
        </AppShell>

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
                <form onSubmit={e => {
                    e.preventDefault();
                    if (quizCode.length !== 7) {
                        showNotification({
                            message: 'Invalid quiz code',
                            color: 'red'
                        });
                        return;
                    }
                    router.push('/student-room/' + quizCode);
                }}>
                    <Group>
                        <TextInput
                            autoFocus
                            style={{ flex: 1 }}
                            value={quizCode}
                            onChange={e => setQuizCode(e.target.value)}
                            placeholder="quiz code" />
                        <Button type='submit'> Join </Button>
                    </Group>
                </form>
            </Stack>
        </Modal>
    </>;
}
