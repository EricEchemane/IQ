import connectToDatabase from "db/connectToDatabase";
import { IQuestion } from "entities/question.entity";
import { AddQuestionPayload } from "http_adapters/adapters/quiz.adapter";
import normalize, { RequestError } from "http_adapters/response_normalizer";
import { NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";

async function handler(req: NextApiRequest, token: JWT) {

    const payload: AddQuestionPayload = JSON.parse(req.body);
    if (!payload.quizId) {
        throw new RequestError(400, 'Missing quizId');
    }
    if (!payload.questions || !payload.questions.length) {
        throw new RequestError(400, 'Missing questions');
    }

    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Database connection error');
    }
    const { Quiz, Question } = db.models;

    const quiz = await Quiz.findById(payload.quizId);
    if (!quiz) {
        throw new RequestError(400, 'Quiz reference not found');
    }

    payload.questions.forEach(async (question) => {
        const newQuestion = new Question(<IQuestion>{
            choices: question.choices,
            correct_choice: question.correct_choice,
            question: question.question,
            timer: question.timer === 'inherit' ? quiz.default_question_timer : question.timer,
            points: question.points ? question.points : 1,
        });
        quiz.questions.push(newQuestion);
    });
    await quiz.save();

    return quiz;
}

export default normalize(handler);