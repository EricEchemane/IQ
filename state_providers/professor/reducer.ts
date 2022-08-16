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
        default:
            return state;
    }
}

export default reducer;