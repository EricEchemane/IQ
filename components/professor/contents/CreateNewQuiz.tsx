import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import useProfessorState, { ProfessorStateType } from 'lib/user-context/professor';
import Quiz from 'entities/quiz.entity';
import React from 'react';

const initialFormValues = {
    title: '',
    code: '',
    date_created: '',
    questions: [],
    participants: [],
    default_question_timer: 5,
    forSections: [],
    author: '',
};

export default function CreateNewQuiz() {
    const { state, dispatch }: ProfessorStateType = useProfessorState();
    const form = useForm({
        initialValues: initialFormValues
    });

    return (
        <div>CreateNewQuiz</div>
    );
}
