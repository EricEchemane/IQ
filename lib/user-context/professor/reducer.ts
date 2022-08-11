import { ProfessorAction, ProfessorActions, IProfessorState } from "./index";

function reducer(state: IProfessorState, { type, payload }: ProfessorAction): IProfessorState {
    switch (type) {
        case ProfessorActions.set_user:
            return payload;
        default:
            return state;
    }
}

export default reducer;