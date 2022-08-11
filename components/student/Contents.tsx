import useUserState, { UserStateType } from 'lib/user-context/student';
import React from 'react';

export default function Contents({ activeTab }: { activeTab: string | null; }) {
    const { state, dispatch }: UserStateType = useUserState();

    if (activeTab === 'quizes') {
        return <div>quizes</div>;
    }
    else if (activeTab === 'participants') {
        return <div>participants</div>;
    }
    else {
        return <div> edit account </div>;
    }
}
