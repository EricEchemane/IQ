import connectToDatabase from 'db/connectToDatabase';
import { IUser } from 'entities/user.entity';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import React from 'react';

export default function StudentRoom({ user }: { user: IUser; }) {
    const router = useRouter();

    return <>

    </>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const redirectObject = {
        redirect: {
            permanent: false,
            destination: '/'
        }
    };

    try {
        const token = await getToken({ req: context.req });
        if (!token) return redirectObject;

        const db = await connectToDatabase();
        if (!db) return redirectObject;

        const user = await db.models.User.findOne({ email: token.email });
        if (!user) return redirectObject;

        return {
            props: {
                user: JSON.parse(JSON.stringify(user))
            }
        };
    } catch (error) {
        return redirectObject;
    }
};