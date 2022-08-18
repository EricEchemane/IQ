import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { IconHome } from '@tabler/icons';
import { useRouter } from 'next/router';
import React from 'react';

export default function Error404() {
    const router = useRouter();
    return (
        <Center style={{ height: '100vh' }}>
            <Stack p='lg' align={'center'}>
                <Title align={'center'}> 404 Not Found </Title>
                <Text align={'center'} mb='xl'> Seems like the page you are looking for does not exist. Or the owner of this site removed that page. </Text>
                <Button
                    onClick={() => {
                        router.replace('/');
                    }}
                    leftIcon={<IconHome strokeWidth={1.5} />}> Return home </Button>
            </Stack>
        </Center>
    );
}
