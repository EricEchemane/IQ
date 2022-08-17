import connectToDatabase from 'db/connectToDatabase';
import { publishQuizPayload } from 'http_adapters/adapters/quiz.adapter';
import normalize, { RequestError } from 'http_adapters/response_normalizer';
import { NextApiRequest } from 'next';

async function handler(req: NextApiRequest) {
    const { quizId }: publishQuizPayload = JSON.parse(req.body);
    if (!quizId) {
        throw new RequestError(400, 'Missing quizId');
    }
    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Failed to connect to database');
    }
    const { Quiz } = db.models;
    const updated = await Quiz.updateOne(
        { _id: quizId },
        { $set: { published: true } });
    if (!updated) {
        throw new RequestError(500, 'Quiz update failed');
    }
    return updated;
}

export default normalize(handler);