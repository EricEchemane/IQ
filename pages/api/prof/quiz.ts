import type { NextApiRequest, NextApiResponse } from "next";
import Quiz from 'entities/quiz.entity';
import connectToDatabase from "lib/connectToDatabase";
import { BadResponse, OkResponse } from "lib/response";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json(BadResponse('Method Not Allowed'));
    }
    try {
        const payload: typeof Quiz = JSON.parse(req.body);
        const db = await connectToDatabase();
        const quiz = await db?.models.Quiz.create(payload);
        res.status(200).json(OkResponse(quiz));
    } catch (error: any) {
        res.status(500).json(BadResponse(error.message, error));
    }
}