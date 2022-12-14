import { Box, Button, Group, NumberInput, PasswordInput, Radio, Select, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import UserAdapter, { RegisterPayload } from 'http_adapters/adapters/user.adapter';
import Image from 'next/image';

export const courses = [
    'Bachelor of Science in Information System | BSIS',
    'Bachelor of Science in Computer Engineering | BSCPE'
]
    .sort().map(c => ({ value: c, label: c }));
export const years = ['1', '2', '3', '4'].map(c => ({ value: c, label: c }));

export default function Register() {
    const router = useRouter();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace('/signin');
        }
    });
    const form = useForm({
        initialValues: {
            email: session?.user?.email,
            name: session?.user?.name,
            image: session?.user?.image,
            type: 'student',
            program: '',
            section: 1,
            year: '',
            adminPasscode: ''
        },
    });
    const registerAdapter = useHttpAdapter<RegisterPayload>(UserAdapter.register);

    useEffect(() => {
        form.setValues(values => ({
            ...values,
            email: session?.user?.email,
            name: session?.user?.name,
            image: session?.user?.image,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user]);

    useEffect(() => {
        if (registerAdapter.data) {
            router.replace('/');
        }
        if (registerAdapter.error) {
            showNotification({
                title: 'Admin error',
                message: registerAdapter.error.message,
                color: 'red'
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerAdapter.data, registerAdapter.error]);

    const handleRegister = async (values: any) => {
        await registerAdapter.execute(values);
    };

    return (
        <>
            <Head> <title> Register | Ayq </title> </Head>

            <Stack sx={{ maxWidth: 300 }} mx="auto" my='4rem'>

                <Group position='apart'>
                    <Title align='center' order={2}> Register </Title>
                    <Image
                        width={60}
                        height={60}
                        src={'/favicon.png'}
                        alt='dfcamclp logo' />
                </Group>


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
                        <Select
                            value={form.values.program}
                            onChange={c => form.setFieldValue('program', c || '')}
                            required
                            label="Program"
                            placeholder="select your program"
                            data={courses}
                        />
                        <Select
                            value={form.values.year}
                            onChange={c => form.setFieldValue('year', c || '')}
                            required
                            label="Year"
                            placeholder="select your year"
                            data={years}
                        />
                        <NumberInput
                            placeholder="Section"
                            label="Section"
                            required
                            min={1}
                            max={20}
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
