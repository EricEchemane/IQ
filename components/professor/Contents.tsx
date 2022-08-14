import { Center, Stack, Text } from '@mantine/core';
import useProfessirState, { ProfessorStateType } from 'state_providers/professor';
import Image from 'next/image';
import React from 'react';
import CreateNewQuiz from './contents/CreateNewQuiz';
import { professorTabs } from 'components/professor';

export default function Contents({ activeTab }: { activeTab: string | null; }) {
    const { state, dispatch }: ProfessorStateType = useProfessirState();

    if (activeTab === professorTabs.view_quizes) {
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
    else if (activeTab === professorTabs.create_new_quiz) {
        return <CreateNewQuiz />;
    }
    else {
        return <div> students </div>;
    }
}
