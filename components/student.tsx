import useUserState, { UserActions, UserStateType } from 'lib/user-context/student';
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
} from '@mantine/core';
import AppHeader from './AppHeader';

export default function Student({ data }: any) {
    const { dispatch, state }: UserStateType = useUserState();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    useEffect(() => {
        dispatch({
            type: UserActions.set_user,
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
                    Navbar
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
            <Text>Resize app to see responsive navbar in action</Text>
        </AppShell>
    );
}
