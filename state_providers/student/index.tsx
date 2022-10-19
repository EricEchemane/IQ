import { useReducer, useContext, createContext } from "react";
import initial_values from "./initial-values";
import reducer from "./reducer";
import Quiz from 'entities/quiz.entity';


export interface IStudentState {
    _id: string;
    email: string;
    name: string;
    image: string;
    program: string;
    section: string;
    year: string;
    quizes: typeof Quiz[];
}

export enum UserActions {
    set_user = 'set_user',
    set_quizzes = 'set_quizzes',
}

export interface UserAction {
    type: UserActions;
    payload: any;
};

type DispatchParams = {
    type: UserActions,
    payload: any;
};

export interface UserStateType {
    state: IStudentState,
    dispatch: ({ type, payload }: DispatchParams) => IStudentState;
}

const AppState = createContext<any>({});

export const UserStateProvider = ({ children }: { children: JSX.Element; }) => {
    const [state, dispatch] = useReducer<any>(reducer, initial_values);
    return (
        <AppState.Provider value={{ state, dispatch }}>
            {children}
        </AppState.Provider>
    );
};

const useUserState = () => useContext(AppState);

export default useUserState;