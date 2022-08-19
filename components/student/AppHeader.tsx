import { Avatar, Group, Stack, Title, Text, Button } from "@mantine/core";
import Link from "next/link";
import { IStudentState } from 'state_providers/student';

export default function AppHeader({ data }: { data: IStudentState; }) {
    return (
        <Group align='center' position="apart" style={{ width: '100%' }}>
            <Group>
                <Avatar src={data.image} alt={`${data.name} profile`} radius={50} />
                <Stack spacing={0}>
                    <Title order={6}> {data.name} </Title>
                    <Text size={'sm'}> {data.email} </Text>
                </Stack>
            </Group>
            <Button> Join a room </Button>
        </Group>
    );
}