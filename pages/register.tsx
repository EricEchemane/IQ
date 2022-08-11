import { Box, Button, Group, PasswordInput, Radio, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

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
            type: 'student',
            course: '',
            section: '',
            adminPasscode: ''
        },
    });

    useEffect(() => {
        form.setValues(values => ({
            ...values,
            email: session?.user?.email
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.email]);

    return (
        <>
            <Head> <title> Register | Ayq </title> </Head>
            <Stack sx={{ maxWidth: 300 }} mx="auto" my='4rem'>
                <Title align='center' order={2}> Register </Title>
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Stack>
        </>
    );
}
