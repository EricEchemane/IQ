import { IQuestion } from "entities/question.entity";
import HttpAdapter from "../base.adapter";

export default class QuizAdapter {

    static createNew: HttpAdapter = {
        url: '/api/quiz/create',
        method: "POST",
    };

    static addQuestion: HttpAdapter = {
        url: '/api/quiz/add-question',
        method: "POST",
    };
}

export type CreateQuizPayload = {
    title: string;
    forSections: string[];
};

export type AddQuestionPayload = {
    quizId: string;
    questions: IQuestion[];
};