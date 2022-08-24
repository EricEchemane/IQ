import connectToDatabase from 'db/connectToDatabase';
import normalize, { RequestError } from 'http_adapters/response_normalizer';
import { NextApiRequest } from 'next';

async function handler(req: NextApiRequest) {
    const { studentId } = JSON.parse(req.body);
    if (!studentId) {
        throw new RequestError(400, 'studentId is required');
    }
    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Database connection failed');
    }

    const { QuizParticipant } = db.models;

    const participants = await QuizParticipant
        .find({ student: studentId })
        .populate('quiz');

    return participants;
}

export default normalize(handler);