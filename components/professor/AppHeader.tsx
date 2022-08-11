import { Avatar, Group, Stack, Title, Text } from "@mantine/core";
import { IProfessorState } from "lib/user-context/professor";

export default function AppHeader({ data }: { data: IProfessorState; }) {
    return (
        <Group position="apart">
            <Group>
                <Avatar src={data.image} alt={`${data.name} profile`} radius={50} />
                <Stack spacing={0}>
                    <Title order={6}> {data.name} </Title>
                    <Text size={'sm'}> {data.email} </Text>
                </Stack>
            </Group>
        </Group>
    );
}