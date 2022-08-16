import connectToDatabase from "db/connectToDatabase";
import { GetQuizzesPayload } from "http_adapters/adapters/quiz.adapter";
import normalize, { RequestError } from "http_adapters/response_normalizer";
import type { NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";

async function handler(req: NextApiRequest, token: JWT) {
    const { userId }: GetQuizzesPayload = JSON.parse(req.body);
    if (!userId) {
        throw new RequestError(400, 'Missing userId');
    }
    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Database connection failed');
    }
    const { Quiz } = db.models;
    const quizzes = await Quiz.find().where({
        author: userId
    });
    if (!quizzes) {
        throw new RequestError(500, 'Quiz not found');
    }

    return quizzes;
}

export default normalize(handler);