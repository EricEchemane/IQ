import { UserAction, UserActions, IStudentState } from "./index";

function reducer(state: IStudentState, { type, payload }: UserAction): IStudentState {
    switch (type) {
        case UserActions.set_user:
            return payload;
        case UserActions.update:
            return payload;
        case UserActions.set_quizzes:
            return { ...state, quizes: payload };
        default:
            return state;
    }
}

export default reducer;