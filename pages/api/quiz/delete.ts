import connectToDatabase from 'db/connectToDatabase';
import { deleteQuizPayload } from 'http_adapters/adapters/quiz.adapter';
import normalize, { RequestError } from 'http_adapters/response_normalizer';
import { NextApiRequest } from 'next';
import { JWT } from 'next-auth/jwt';

async function handler(req: NextApiRequest, token: JWT) {
    const { quizId, userId }: deleteQuizPayload = JSON.parse(req.body);
    if (!quizId || !userId) {
        throw new RequestError(400, 'Missing required parameters');
    }
    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Could not connect to database');
    }
    const { Quiz } = db.models;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new RequestError(404, 'Quiz not found');
    }
    if (quiz.author.toString() !== userId) {
        throw new RequestError(403, 'You do not have permission to delete this quiz');
    }

    const deleted = await Quiz.deleteOne({ _id: quizId });
    if (!deleted) {
        throw new RequestError(500, 'Could not delete quiz');
    }
    return deleted;
}

export default normalize(handler);