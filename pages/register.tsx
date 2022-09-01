import { Box, Button, Group, PasswordInput, Radio, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import UserAdapter, { RegisterPayload } from 'http_adapters/adapters/user.adapter';

export default function Register() { // /register page
    const router = useRouter();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace('/signin');
        }
    });
    // useForm - setup ng form values, kada value dun sa initialValues
    const form = useForm({
        initialValues: {
            email: session?.user?.email,
            name: session?.user?.name,
            image: session?.user?.image,
            type: 'student',
            course: '',
            section: '',
            adminPasscode: ''
        },
    });
    // uses register module
    const registerAdapter = useHttpAdapter<RegisterPayload>(UserAdapter.register);

    // this function reruns or called everytime session.user is change
    useEffect(() => {
        form.setValues(values => ({
            ...values,
            email: session?.user?.email,
            name: session?.user?.name,
            image: session?.user?.image,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user]); // ito yung session.user

    useEffect(() => {
        // if successful yung register, may data, punta sa index page - '/'
        if (registerAdapter.data) {
            router.replace('/');
        }
        if (registerAdapter.error) { // pag hindi successful yung register kaya may error
            // display notification sa screen
            showNotification({
                title: 'Admin error',
                message: registerAdapter.error.message,
                color: 'red'
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerAdapter.data, registerAdapter.error]);

    // a function to execute or trigger the register adapter
    const handleRegister = async (values: any) => {
        await registerAdapter.execute(values);
    };

    // lahat ng nasa baba is yung mismong markup page
    return (
        <>
            <Head> <title> Register | Ayq </title> </Head>

            <Stack sx={{ maxWidth: 300 }} mx="auto" my='4rem'>

                <Title align='center' order={2}> Register </Title>

                {/* call the register function kapag nasubmit */}
                <form onSubmit={form.onSubmit(handleRegister)}>
                    <TextInput
                        label={session?.user?.name || 'Email'}
                        placeholder="your@email.com"
                        disabled
                        defaultValue={session?.user?.email || ''}
                    />

                    <Radio.Group
                        value={form.values.type}
                        onChange={(value) => {
                            form.setValues({
                                ...form.values,
                                type: value
                            });
                        }}
                        label="Your role"
                        required
                        my='1rem'
                    >
                        <Radio value="student" label="Student" />
                        <Radio value="professor" label="Professor" />
                    </Radio.Group>

                    {form.values.type === 'student' && <Box>
                        <TextInput
                            required
                            label='Course'
                            {...form.getInputProps('course')}
                        />
                        <TextInput
                            required
                            label='Section'
                            {...form.getInputProps('section')}
                        />
                    </Box>}

                    {form.values.type === 'professor' && <Box>
                        <PasswordInput
                            required
                            label='Admin passcode'
                            {...form.getInputProps('adminPasscode')}
                        />
                    </Box>}

                    <Group position="right" mt="md">
                        <Button onClick={(e: any) => {
                            e.preventDefault();
                            signOut();
                        }} variant='outline'>Cancel</Button>
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Stack>
        </>
    );
}
