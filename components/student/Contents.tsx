import useUserState, { UserStateType } from 'state_providers/student';
import React, { useEffect } from 'react';
import Quizzes from './contents/Quizzes';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import QuizAdapter, { getQuizzesByStudentIdPayload } from 'http_adapters/adapters/quiz.adapter';
import { Box } from '@mantine/core';

export default function Contents({ activeTab }: { activeTab: string | null; }) {
    const { state, dispatch }: UserStateType = useUserState();
    const getQuizzesAdapter = useHttpAdapter<getQuizzesByStudentIdPayload>(QuizAdapter.getByStudentId);

    useEffect(() => {
        if (state._id === '') return;
        getQuizzesAdapter.execute({ studentId: state._id });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    if (activeTab === 'quizes') {
        return <Quizzes quizzes={getQuizzesAdapter.data} />;
    }
    else if (activeTab === 'participants') {
        return <div>participants</div>;
    }
    else {
        return <>
            <div style={{
                backgroundColor: 'red',
                display: 'flex',
                justifyContent: 'space-evenly',
                flexWrap: 'wrap'
            }}>
                <Box p={4} style={{ backgroundColor: 'blue' }} m={5}>
                    hello
                </Box>
                <Box p={4} style={{ backgroundColor: 'blue' }} m={5}>
                    hello
                </Box>
                <Box p={4} style={{ backgroundColor: 'blue' }} m={5}>
                    hello
                </Box>
            </div>
        </>;
    }
}
