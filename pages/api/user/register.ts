import connectToDatabase from 'db/connectToDatabase';
import type { NextApiRequest } from "next";
import { RegisterPayload } from 'http_adapters/adapters/user.adapter';
import normalize, { RequestError } from 'http_adapters/response_normalizer';
import { JWT } from "next-auth/jwt";

async function handler(req: NextApiRequest, token: JWT) {
    if (req.method !== "POST") {
        throw new RequestError(405, "Method not allowed");
    }

    const {
        email,
        name,
        image,
        type,
        course,
        section,
        adminPasscode,
    }: RegisterPayload = JSON.parse(req.body);

    if (!email.endsWith('@dfcamclp.edu.ph')) {
        throw new RequestError(403, "Only students from DFCAMCLP are allowed to register");
    }

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
            return user;
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
            return professor;
        default:
            throw new Error('Invalid type');
    }
}

export default normalize(handler);