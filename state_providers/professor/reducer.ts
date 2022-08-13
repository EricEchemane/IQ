import { ProfessorAction, ProfessorActions, IProfessorState } from "./index";
import Quiz from 'entities/quiz.entity';
import createNewQuiz from "./create-new-quiz";

function reducer(state: IProfessorState, { type, payload }: ProfessorAction): IProfessorState {
    switch (type) {
        case ProfessorActions.set_user:
            return payload;
        case ProfessorActions.create_new_quiz:
            const newQuiz: typeof Quiz = payload;
            createNewQuiz(newQuiz)
                .then(quiz => {
                    return {
                        ...state,
                        quizes: [...state.quizes, quiz]
                    };
                }).catch(err => {
                    console.log(err);
                    return state;
                });
        default:
            return state;
    }
}

export default reducer;