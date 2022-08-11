import { OkResponse } from 'lib/response';
import connectToDatabase from 'lib/connectToDatabase';
import { BadResponse } from 'lib/response';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).json(BadResponse("Method not allowed"));
        return;
    }

    const {
        email,
        name,
        image,
        type,
        course,
        section,
        adminPasscode,
    } = JSON.parse(req.body);

    try {
        const db = await connectToDatabase();
        switch (type) {
            case 'student':
                const user = await db?.model('User').create({
                    email,
                    course,
                    section,
                    name,
                    image,
                    type
                });
                res.status(200).json(OkResponse(user));
                break;
            case 'professor':
                if (adminPasscode !== process.env.ADMIN_PASSCODE) {
                    throw new Error('Invalid admin passcode');
                }
                const professor = await db?.models.User.create({
                    email,
                    type,
                    name,
                    image
                });
                res.status(200).json(OkResponse(professor));
                break;
            default:
                throw new Error('Invalid type');
        }
    } catch (error: any) {
        res.status(500).json(BadResponse(error.message, error));
    }
}