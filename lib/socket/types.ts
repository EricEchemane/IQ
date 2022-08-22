import { IQuiz } from "entities/quiz.entity";
import { IUser } from "entities/user.entity";
import { NextApiResponse } from "next";
import { Socket as SSocket } from "socket.io";
import { Socket as CSocket } from "socket.io-client";
import { ClientEvents } from "./clientEvents";
import { QuizRoom } from './quizRoom';

export type SocketRes = NextApiResponse & {
    socket: {
        server: any;
    };
};

export type createRoomPayload = {
    room: string;
    user: IUser;
    quiz: IQuiz;
};
export type joinRoomPayload = {
    room: string;
    user: IUser;
};

export interface ServerEvents {
    "participant:joined": (quizRoom: QuizRoom) => void;
    "participant:leave": (quizRoom: QuizRoom) => void;
    "room:destroyed": (room: string) => void;
    "quiz:started": (quizRoom: QuizRoom) => void;
    "quiz:stopped": (quizRoom: QuizRoom) => void;
    "timer:changed": (count: number) => void;
    "question:next": (quizRoom: QuizRoom) => void;
}

export type ClientSocket = CSocket<ServerEvents, ClientEvents>;
export type ServerSocket = SSocket<ClientEvents, ServerEvents>;

export type participant = {
    socketId: string;
    answers: string[];
    student: IUser;
    final_score: number;
    number_of_correct_answers: number;
};
