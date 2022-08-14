import connectToDatabase from 'db/connectToDatabase';
import normalize, { RequestError } from "http_adapters/response_normalizer";
import { CreateQuizPayload } from 'http_adapters/adapters/quiz.adapter';
import type { NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";
import { IQuiz } from 'entities/quiz.entity';

async function handler(req: NextApiRequest, token: JWT) {
    const { forSections, title }: CreateQuizPayload = JSON.parse(req.body);

    if (forSections.length === 0) {
        throw new RequestError(400, 'Requires atleast one section as the participant');
    }
    if (title.replaceAll(' ', '').length < 5) {
        throw new RequestError(400, 'Title must be at least 5 characters long');
    }

    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Database connection failed');
    }

    const { User, Quiz } = db.models;
    const user = await User.findOne({ email: token.email });
    if (!user || user.type !== 'professor') {
        throw new RequestError(403, 'You are not authorized to create quizzes');
    }

    const quiz = new Quiz(<IQuiz>{
        title,
        author: user._id,
        forSections
    });
    await quiz.save().catch((err: any) => {
        if (err && err.code === 11000) {
            throw new RequestError(400, 'Quiz with this title already exists');
        }
    });
    return quiz;
}

export default normalize(handler);