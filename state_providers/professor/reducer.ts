import { UpdateAQuestionPayload } from "http_adapters/adapters/quiz.adapter";
import { ProfessorAction, ProfessorActions, IProfessorState } from "./index";

function reducer(state: IProfessorState, { type, payload }: ProfessorAction): IProfessorState {
    switch (type) {
        case ProfessorActions.set_user:
            return payload;
        case ProfessorActions.push_new_quiz:
            return {
                ...state,
                quizes: [...state.quizes, payload]
            };
        case ProfessorActions.update_question:
            // find the quiz with the id
            const _payload = payload as UpdateAQuestionPayload;
            const _state = { ...state };
            const quiz: any = _state.quizes.find((quiz: any) => quiz._id === _payload.quizId);
            // find the question with the id
            const index = quiz.questions.findIndex((question: any) => question._id === _payload.questionId);
            // update the question
            quiz.questions[index] = { ...quiz.questions[index], ..._payload };
            return _state;
        default:
            return state;
    }
}

export default reducer;