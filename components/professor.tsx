import useProfessorState, { ProfessorActions, ProfessorStateType } from 'lib/user-context/professor';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Aside,
    Text,
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

export default function Student({ data }: any) {
    const { dispatch, state }: ProfessorStateType = useProfessorState();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>('view-quizes');

    useEffect(() => {
        dispatch({
            type: ProfessorActions.set_user,
            payload: data
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

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
                                value="view-quizes"> View quizes </Tabs.Tab>
                            <Tabs.Tab
                                icon={<IconPencilPlus strokeWidth={1} />}
                                value="create-new-quiz"> Create new quiz </Tabs.Tab>
                            <Tabs.Tab
                                icon={<IconUsers strokeWidth={1} />}
                                value="students"> My students </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                </Navbar>
            }
            aside={
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
                        <Text>Application sidebar</Text>
                    </Aside>
                </MediaQuery>
            }
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
            <Contents activeTab={activeTab} />
        </AppShell>
    );
}
