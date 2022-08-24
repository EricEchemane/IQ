import connectToDatabase from 'db/connectToDatabase';
import { getParticipantsPayload } from 'http_adapters/adapters/quiz.adapter';
import normalize, { RequestError } from 'http_adapters/response_normalizer';
import { NextApiRequest } from 'next';

async function hanlder(req: NextApiRequest) {
    const { quizId }: getParticipantsPayload = JSON.parse(req.body);
    if (!quizId) {
        throw new RequestError(400, 'Missing quizId');
    }
    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Could not connect to database');
    }
    const { QuizParticipant } = db.models;

    const participants = await QuizParticipant.find({ quiz: quizId }).populate('student');
    if (!participants) {
        return [];
    }
    return participants;
}

export default normalize(hanlder);