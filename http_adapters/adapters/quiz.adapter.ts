import { IQuestion } from "entities/question.entity";
import HttpAdapter from "../base.adapter";

export default class QuizAdapter {

    static createNew: HttpAdapter = {
        url: '/api/quiz/create',
        method: "POST",
    };
    static get: HttpAdapter = {
        url: '/api/quiz/get',
        method: "POST",
    };
    static updateAQuestion: HttpAdapter = {
        url: '/api/quiz/update-question',
        method: "POST",
    };
}

export type CreateQuizPayload = {
    title: string;
    forSections: string[];
    questions: IQuestion[];
};

export type GetQuizzesPayload = {
    userId: string;
};

export type UpdateAQuestionPayload = IQuestion & {
    questionId: string;
    quizId: string;
};