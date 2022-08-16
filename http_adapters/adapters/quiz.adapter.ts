import { IQuestion } from "entities/question.entity";
import HttpAdapter from "../base.adapter";

export default class QuizAdapter {

    static createNew: HttpAdapter = {
        url: '/api/quiz/create',
        method: "POST",
    };
    static get: HttpAdapter = {
        url: '/api/quiz/get',
        method: "GET",
    };
}

export type CreateQuizPayload = {
    title: string;
    forSections: string[];
    questions: IQuestion[];
};