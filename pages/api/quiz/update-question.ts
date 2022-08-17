import connectToDatabase from 'db/connectToDatabase';
import { UpdateAQuestionPayload } from 'http_adapters/adapters/quiz.adapter';
import normalize, { RequestError } from 'http_adapters/response_normalizer';
import { NextApiRequest } from 'next';
import { JWT } from 'next-auth/jwt';

async function handler(req: NextApiRequest, _: JWT) {
    const payload: UpdateAQuestionPayload = JSON.parse(req.body);

    if (!payload.quizId) {
        throw new RequestError(400, 'Missing quiz id');
    }

    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Database connection failed');
    }

    const { Quiz } = db.models;
    const quiz = await Quiz.findById(payload.quizId);
    if (!quiz) {
        throw new RequestError(404, 'Quiz not found');
    }

    if (!payload.questionId) {
        throw new RequestError(400, 'Missing question id');
    }

    const {
        questionId,
        quizId,
        choices,
        correct_choice,
        question,
        timer,
        points
    } = payload;

    const updated = await Quiz.updateOne(
        { _id: quizId, "questions._id": questionId },
        {
            $set: {
                "questions.$.question": question,
                "questions.$.choices": choices,
                "questions.$.correct_choice": correct_choice,
                "questions.$.timer": timer,
                "questions.$.points": points,
            }
        }
    );
    if (!updated) {
        throw new RequestError(404, 'Question not found');
    }

    return updated;
}

export default normalize(handler);