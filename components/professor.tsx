import useProfessorState, { ProfessorActions, ProfessorStateType } from 'state_providers/professor';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    MediaQuery,
    Burger,
    useMantineTheme,
    Group,
    Button,
    Tabs,
    Title,
} from '@mantine/core';
import AppHeader from './professor/AppHeader';
import { IconList, IconPencilPlus, IconUsers } from '@tabler/icons';
import Contents from './professor/Contents';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import QuizAdapter, { GetQuizzesPayload } from 'http_adapters/adapters/quiz.adapter';
import UserAdapter from 'http_adapters/adapters/user.adapter';

export const professorTabs = Object.freeze({
    view_quizes: 'view_quizes',
    create_new_quiz: 'create_new_quiz',
    my_students: 'my_students',
});

export default function Student({ data }: any) {
    const { dispatch, state }: ProfessorStateType = useProfessorState();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>(professorTabs.view_quizes);
    const getQuizzesAdapter = useHttpAdapter<GetQuizzesPayload>(QuizAdapter.get);
    const deleteAccountAdapter = useHttpAdapter(UserAdapter.deleteAccount);

    const deleteAccount = async () => {
        const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone. Click cancel if you change your mind");
        if (confirmed) {
            const data = await deleteAccountAdapter.execute();
            if (data) signOut();
        }
    };

    useEffect(() => {
        if (data) getQuizzesAdapter.execute({ userId: data._id });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (getQuizzesAdapter.data) {
            dispatch({
                type: ProfessorActions.set_user,
                payload: {
                    ...data,
                    quizes: getQuizzesAdapter.data
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getQuizzesAdapter.data]);

    return (
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
                    <Title order={6}>Professor</Title>

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
                                icon={<IconList strokeWidth={1} />}
                                value={professorTabs.view_quizes}> View quizes </Tabs.Tab>
                            <Tabs.Tab
                                icon={<IconPencilPlus strokeWidth={1} />}
                                value={professorTabs.create_new_quiz}> Create new quiz </Tabs.Tab>
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
            <Contents activeTab={activeTab} onSaveSuccess={() => setActiveTab(professorTabs.view_quizes)} />
        </AppShell>
    );
}
