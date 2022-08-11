import React from 'react';

export default function Contents({ activeTab }: { activeTab: string | null; }) {
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
