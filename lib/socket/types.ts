import { IQuiz } from "entities/quiz.entity";
import { IUser } from "entities/user.entity";
import { NextApiResponse } from "next";
import { Socket as SSocket } from "socket.io";
import { Socket as CSocket } from "socket.io-client";
import { ClientEvents } from "./clientEvents";
import { ServerEvents } from "./serverEvents";

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
export type submitAnswerPayload = {
    room: string;
    answer: string;
    userId: string;
    isCorrect: boolean;
};
export type quizResult = {
    ranking: number;
    finalScore: number;
};

export type ClientSocket = CSocket<ServerEvents, ClientEvents>;
export type ServerSocket = SSocket<ClientEvents, ServerEvents>;

export type participant = {
    answers: string[];
    student: IUser;
    final_score: number;
    number_of_correct_answers: number;
};
