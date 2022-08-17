import { deleteQuizPayload, publishQuizPayload, UpdateAQuestionPayload, updateQuizTitlePayload } from "http_adapters/adapters/quiz.adapter";
import { ProfessorAction, ProfessorActions, IProfessorState } from "./index";

function reducer(state: IProfessorState, { type, payload }: ProfessorAction): IProfessorState {
    let _payload: any, _state: any;
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
            _payload = payload as UpdateAQuestionPayload;
            _state = { ...state };
            const quiz: any = _state.quizes.find((quiz: any) => quiz._id === _payload.quizId);
            // find the question with the id
            const index = quiz.questions.findIndex((question: any) => question._id === _payload.questionId);
            // update the question
            quiz.questions[index] = { ...quiz.questions[index], ..._payload };
            return _state;
        case ProfessorActions.update_quiz_title:
            _state = { ...state };
            const { quizId, title } = payload as updateQuizTitlePayload;
            const quiz2: any = _state.quizes.find((quiz: any) => quiz._id === quizId);
            quiz2.title = title;
            return _state;
        case ProfessorActions.publish_quiz:
            _state = null, _state = null;
            _state = { ...state };
            _payload = payload as publishQuizPayload;
            const quiz3: any = _state.quizes.find((quiz: any) => quiz._id === _payload.quizId);
            quiz3.published = true;
            return _state;
        case ProfessorActions.unpublish_quiz:
            _state = null, _state = null;
            _state = { ...state };
            _payload = payload as publishQuizPayload;
            const quiz4: any = _state.quizes.find((quiz: any) => quiz._id === _payload.quizId);
            quiz4.published = false;
            return _state;
        case ProfessorActions.delete_quiz:
            _state = null, _state = null;
            _state = { ...state };
            _payload = payload as deleteQuizPayload;
            _state.quizes = _state.quizes.filter((quiz: any) => quiz._id === _payload.quizId);
            return _state;
        default:
            return state;
    }
}

export default reducer;