import useProfessirState, { ProfessorStateType } from 'lib/user-context/professor';
import React from 'react';

export default function Contents({ activeTab }: { activeTab: string | null; }) {
    const { state, dispatch }: ProfessorStateType = useProfessirState();

    if (activeTab === 'view-quizes') {
        return <div>view-quizes</div>;
    }
    else if (activeTab === 'create-new-quiz') {
        return <div>create-new-quiz</div>;
    }
    else {
        return <div> students </div>;
    }
}
