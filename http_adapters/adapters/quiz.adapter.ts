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
    static updateTitle: HttpAdapter = {
        url: '/api/quiz/update-title',
        method: "POST",
    };
    static publish: HttpAdapter = {
        url: '/api/quiz/publish',
        method: "POST",
    };
    static unpublish: HttpAdapter = {
        url: '/api/quiz/unpublish',
        method: "POST",
    };
    static delete: HttpAdapter = {
        url: '/api/quiz/delete',
        method: "POST",
    };
    static getParticipants: HttpAdapter = {
        url: '/api/quiz/get-participants',
        method: "POST",
    };
    static getByStudentId: HttpAdapter = {
        url: '/api/quiz/get-by-student-id',
        method: "POST",
    };
}

export type CreateQuizPayload = {
    title: string;
    program: string;
    course: string;
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

export type updateQuizTitlePayload = {
    quizId: string;
    title: string;
};

export type publishQuizPayload = {
    quizId: string;
};

export type unpublishQuizPayload = {
    quizId: string;
};

export type deleteQuizPayload = {
    quizId: string;
    userId: string;
};

export type getParticipantsPayload = {
    quizId: string;
};

export type getQuizzesByStudentIdPayload = {
    studentId: string;
};