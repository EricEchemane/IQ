import connectToDatabase from 'db/connectToDatabase';
import { LoginPayload } from 'http_adapters/user.adapter';
import { BadResponse, OkResponse } from "lib/response";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).json(BadResponse("Method not allowed"));
        return;
    }

    const { email }: LoginPayload = JSON.parse(req.body);

    if (!email) {
        res.status(400).json(BadResponse("email is required"));
        return;
    }

    const db = await connectToDatabase()
        .catch(err => {
            res.status(500).json(BadResponse(err.message, err));
            return;
        });

    const user = await db?.model('User').findOne({ email });
    if (!user) {
        res.status(404).json(BadResponse("User not found"));
        return;
    }

    res.json(OkResponse(user));
}