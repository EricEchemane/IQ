import connectToDatabase from 'db/connectToDatabase';
import { unpublishQuizPayload } from 'http_adapters/adapters/quiz.adapter';
import normalize, { RequestError } from 'http_adapters/response_normalizer';
import { NextApiRequest } from 'next';

async function handler(req: NextApiRequest) {
    const { quizId }: unpublishQuizPayload = JSON.parse(req.body);
    if (!quizId) {
        throw new RequestError(400, 'Missing quizId');
    }
    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Database connection failed');
    }
    const { Quiz } = db.models;
    const quiz = await Quiz.findById(quizId).populate('participants');
    if (!quiz) {
        throw new RequestError(404, 'Quiz not found');
    }

    if (quiz.participants && quiz.participants.length !== 0) {
        throw new RequestError(403, 'Cannot unpublish this quiz because there are students that already took it');
    }
    else {
        const quiz = await Quiz.updateOne(
            { _id: quizId },
            { $set: { published: false } }
        );
        return quiz;
    }
}

export default normalize(handler);