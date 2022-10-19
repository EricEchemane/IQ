import { Button, Group, NumberInput, Select, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import UserAdapter from "http_adapters/adapters/user.adapter";
import useHttpAdapter from "http_adapters/useHttpAdapter";
import { courses, years } from "pages/register";
import { FormEvent, useEffect } from "react";
import useUserState, { UserActions, UserStateType } from "state_providers/student";

export default function EditAccount() {
    const { state, dispatch }: UserStateType = useUserState();
    const adapter = useHttpAdapter(UserAdapter.updateAccount);
    const form = useForm({
        initialValues: {
            ...state,
            section: parseInt(state.section)
        }
    });

    useEffect(() => {
        if (adapter.data) {
            dispatch({
                type: UserActions.update, payload: {
                    ...form.values, section: form.values.section.toString()
                }
            });
            showNotification({
                title: 'Success',
                message: "Changes saved!",
                color: 'green',
            });
        }
        if (adapter.error) {
            showNotification({
                title: 'Error',
                message: adapter.error.message,
                color: 'red'
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adapter.data, adapter.error]);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (
            form.values.program === state.program &&
            form.values.section === +state.section &&
            form.values.year === state.year
        ) {
            alert('No changes detected');
            return;
        }
        await adapter.execute(form.values);
    };

    return <>
        <Title order={3}>
            You are editing your account
        </Title>
        <form onSubmit={onSubmit}>
            <Stack my={'lg'}>
                <TextInput
                    readOnly
                    name="name"
                    defaultValue={form.values.name}
                    label="Full name" />
                <TextInput
                    readOnly
                    name="email"
                    defaultValue={form.values.email}
                    label="Email" />
                <Group my={'lg'} spacing={10}>
                    <Select
                        value={form.values.program}
                        onChange={c => form.setFieldValue('program', c || '')}
                        required
                        name="year"
                        label="Program"
                        placeholder="select your program"
                        data={courses}
                    />
                    <Select
                        value={form.values.year}
                        onChange={c => form.setFieldValue('year', c || '')}
                        required
                        name="year"
                        label="Year"
                        placeholder="select your year"
                        data={years}
                    />
                    <NumberInput
                        placeholder="Section"
                        label="Section"
                        name="section"
                        required
                        min={1}
                        max={20}
                        value={form.getInputProps('section').value}
                        {...form.getInputProps('section')}
                    />
                </Group>
            </Stack>
            <Button type="submit"> Save </Button>
        </form>
    </>;
}
