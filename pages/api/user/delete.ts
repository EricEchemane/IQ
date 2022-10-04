import connectToDatabase from 'db/connectToDatabase';
import normalize, { RequestError } from 'http_adapters/response_normalizer';
import { LoginPayload } from 'http_adapters/adapters/user.adapter';
import type { NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";

async function handler(req: NextApiRequest, token?: JWT) {
    if (req.method !== "DELETE") {
        throw new RequestError(405, "Method not allowed");
    }

    const email = token?.email;
    if (!email) {
        throw new RequestError(400, "Email is required");
    }

    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, "Database connection failed");
    }

    const deleted = await db.model('User').deleteOne({ email });
    if (deleted.deletedCount === 0) {
        throw new RequestError(404, "User not found");
    }
    return deleted;
}

export default normalize(handler);