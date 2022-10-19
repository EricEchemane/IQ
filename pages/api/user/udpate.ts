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
        program,
        section,
        year,
    }: RegisterPayload = JSON.parse(req.body);

    const db = await connectToDatabase();
    if (!db) {
        throw new Error('Database not connected');
    }

    const { User } = db.models;
    const updated = await User.updateOne(
        { email: token.email },
        { $set: { program, section, year } }
    );

    return updated;
}

export default normalize(handler);