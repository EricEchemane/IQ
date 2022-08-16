import { Center, Stack, Text } from '@mantine/core';
import useProfessorState, { ProfessorStateType } from 'state_providers/professor';
import Image from 'next/image';
import React from 'react';
import CreateNewQuiz from './contents/CreateNewQuiz';
import { professorTabs } from 'components/professor';
import ViewQuizes from './contents/ViewQuizes';

export default function Contents({ activeTab, onSaveSuccess }: {
    activeTab: string | null;
    onSaveSuccess: Function;
}) {
    const { state, dispatch }: ProfessorStateType = useProfessorState();

    if (activeTab === professorTabs.view_quizes) {
        if (state.quizes.length === 0) return <>
            <Center style={{ height: '100%' }}>
                <Stack align={'center'}>
                    <Image src='/arts/no-quizzes.svg' alt='no quizzes' width={200} height={200} />
                    <Text color='dimmed' size={'lg'}> You have no quizes yet </Text>
                </Stack>
            </Center>
        </>;
        else return <ViewQuizes />;
    }
    else if (activeTab === professorTabs.create_new_quiz) {
        return <CreateNewQuiz onSaveSuccess={onSaveSuccess} />;
    }
    else {
        return <div> students </div>;
    }
}
