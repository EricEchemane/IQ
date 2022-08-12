import { Center, Stack, Text, Title } from '@mantine/core';
import useProfessirState, { ProfessorStateType } from 'lib/user-context/professor';
import Image from 'next/image';
import React from 'react';

export default function Contents({ activeTab }: { activeTab: string | null; }) {
    const { state, dispatch }: ProfessorStateType = useProfessirState();

    if (activeTab === 'view-quizes') {
        if (state.quizes.length === 0) return <>
            <Center style={{ height: '100%' }}>
                <Stack align={'center'}>
                    <Image src='/arts/no-quizzes.svg' alt='no quizzes' width={200} height={200} />
                    <Text color='dimmed' size={'lg'}> You have no quizes yet </Text>
                </Stack>
            </Center>
        </>;
        else return <>
            <div> display the quizes </div>
        </>;
    }
    else if (activeTab === 'create-new-quiz') {
        return <div>create-new-quiz</div>;
    }
    else {
        return <div> students </div>;
    }
}
