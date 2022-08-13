import { UserAction, UserActions, IStudentState } from "./index";

function reducer(state: IStudentState, { type, payload }: UserAction): IStudentState {
    switch (type) {
        case UserActions.set_user:
            return payload;
        default:
            return state;
    }
}

export default reducer;