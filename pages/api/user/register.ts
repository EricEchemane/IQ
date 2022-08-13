import { OkResponse } from 'lib/response';
import connectToDatabase from 'db/connectToDatabase';
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
        if (!db) {
            throw new Error('Database not connected');
        }
        const { User } = db.models;

        switch (type) {
            case 'student':
                const user = new User({
                    email,
                    course,
                    section,
                    name,
                    image,
                    type
                });
                await user.save();
                res.status(200).json(OkResponse(user));
                break;
            case 'professor':
                if (adminPasscode !== process.env.ADMIN_PASSCODE) {
                    throw new Error('Invalid admin passcode');
                }
                const professor = new User({
                    email,
                    type,
                    name,
                    image
                });
                await professor.save();
                res.status(200).json(OkResponse(professor));
                break;
            default:
                throw new Error('Invalid type');
        }
    } catch (error: any) {
        res.status(500).json(BadResponse(error.message, error));
    }
}