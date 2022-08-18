import connectToDatabase from 'db/connectToDatabase';
import { IQuiz } from 'entities/quiz.entity';
import { IUser } from 'entities/user.entity';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

export default function QuizRoom({ user, quiz }: {
    user: IUser;
    quiz: IQuiz;
}) {
    const router = useRouter();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace('/signin');
        }
    });
    console.log(user, quiz);


    return (
        <div>quiz-room</div>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params } = context;
    if (!params) return redirectObject;

    const { uid, qid } = params;
    if (!uid || !qid) return redirectObject;

    const db = await connectToDatabase();
    if (!db) return redirectObject;

    const { User, Quiz } = db.models;

    const user = await User.findById(uid);
    if (!user) return redirectObject;
    if (user.type !== 'professor') return redirectObject;

    const quiz = await Quiz.findById(qid);
    if (!quiz) return redirectObject;

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            quiz: JSON.parse(JSON.stringify(quiz)),
        }
    };
};

const redirectObject = {
    redirect: {
        permanent: false,
        destination: "/",
    },
    props: {},
};