import { Group, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormEvent } from "react";
import useUserState, { UserStateType } from "state_providers/student";

export default function EditAccount() {
    const { state, dispatch }: UserStateType = useUserState();
    const form = useForm({ initialValues: state });

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(e);
    };

    return <>
        <Title order={3}>
            You are editing your account
        </Title>
        <form onSubmit={onSubmit}>
            <Group my={'lg'} spacing={10}>
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
            </Group>
        </form>
    </>;
}
