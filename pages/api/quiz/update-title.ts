import connectToDatabase from 'db/connectToDatabase';
import { updateQuizTitlePayload } from 'http_adapters/adapters/quiz.adapter';
import normalize, { RequestError } from 'http_adapters/response_normalizer';
import { NextApiRequest } from 'next';

async function handler(req: NextApiRequest) {
    const { quizId, title }: updateQuizTitlePayload = JSON.parse(req.body);
    if (!quizId || !title) {
        throw new RequestError(400, 'Missing quizId or title');
    }
    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Database connection failed');
    }

    const { Quiz } = db.models;
    const updated = await Quiz.updateOne(
        { _id: quizId },
        { $set: { title } }
    );
    if (!updated) {
        throw new RequestError(500, 'Quiz update failed');
    }
    return updated;
}

export default normalize(handler);