import { useReducer, useContext, createContext } from "react";
import initial_values from "./initial-values";
import reducer from "./reducer";
import Quiz from 'entities/quiz.entity';

export interface IProfessorState {
    email: string;
    name: string;
    image: string;
    quizes: typeof Quiz[];
}

export enum ProfessorActions {
    set_user = 'set_user'
}

export interface ProfessorAction {
    type: ProfessorActions;
    payload: any;
};

type DispatchParams = {
    type: ProfessorActions,
    payload: any;
};

export interface ProfessorStateType {
    state: IProfessorState,
    dispatch: ({ type, payload }: DispatchParams) => IProfessorState;
}

const AppState = createContext<any>({});

export const ProfessorStateProvider = ({ children }: { children: JSX.Element; }) => {
    const [state, dispatch] = useReducer<any>(reducer, initial_values);
    return (
        <AppState.Provider value={{ state, dispatch }}>
            {children}
        </AppState.Provider>
    );
};

const useProfessorState = () => useContext(AppState);

export default useProfessorState;