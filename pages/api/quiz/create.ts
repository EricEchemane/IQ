import connectToDatabase from 'db/connectToDatabase';
import normalize, { RequestError } from "http_adapters/response_normalizer";
import { CreateQuizPayload } from 'http_adapters/adapters/quiz.adapter';
import type { NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";
import { IQuiz } from 'entities/quiz.entity';
import { IQuestion } from 'entities/question.entity';

async function handler(req: NextApiRequest, token: JWT) {
    const { forSections, title, questions, program, course }: CreateQuizPayload = JSON.parse(req.body);

    if (forSections.length === 0) {
        throw new RequestError(400, 'Requires atleast one section as the participant');
    }
    if (title.replaceAll(' ', '').length < 5) {
        throw new RequestError(400, 'Title must be at least 5 characters long');
    }
    if (!questions || !questions.length) {
        throw new RequestError(400, 'Missing questions');
    }

    const db = await connectToDatabase();
    if (!db) {
        throw new RequestError(500, 'Database connection failed');
    }

    const { User, Quiz, Question } = db.models;
    const user = await User.findOne({ email: token.email });
    if (!user || user.type !== 'professor') {
        throw new RequestError(403, 'You are not authorized to create quizzes');
    }

    const quiz = new Quiz(<IQuiz>{
        title,
        program,
        course,
        author: user._id,
        forSections,
    });

    questions.forEach(async (question) => {
        const newQuestion = new Question(<IQuestion>{
            choices: question.choices,
            correct_choice: question.correct_choice,
            question: question.question,
            timer: question.timer === 'inherit' ? quiz.default_question_timer : question.timer,
            points: question.points ? question.points : 1,
            forQuiz: quiz._id,
            type: question.type,
        });
        quiz.questions.push(newQuestion);
    });

    await quiz.save().catch((err: any) => {
        if (err && err.code === 11000) {
            throw new RequestError(400, 'Quiz with this title already exists');
        }
    });

    return quiz;
}

export default normalize(handler);