import { IQuizParticipant } from "entities/quiz-participant.entity";
import { IQuiz } from "entities/quiz.entity";
import { IUser } from "entities/user.entity";
import { NextApiResponse } from "next";
import { Socket as SSocket } from "socket.io";
import { Socket as CSocket } from "socket.io-client";

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

export interface ServerEvents {

}

export interface ClientEvents {
    "create:room": (
        payload: createRoomPayload,
        callback: (err: any, data: any) => void
    ) => void;
}

export type ClientSocket = CSocket<ServerEvents, ClientEvents>;
export type ServerSocket = SSocket<ClientEvents, ServerEvents>;

export class QuizRoom {
    room: string;
    user: IUser;
    quiz: IQuiz;
    participants: {
        answers: string[];
        student: IUser;
        final_score: number;
        number_of_correct_answers: number;
    }[] = [];
    isStarted: boolean = false;
    isEnded: boolean = false;
    currentIndexOfQuestion: number = -1; // -1 means not yet started

    constructor(
        room: string,
        user: IUser,
        quiz: IQuiz
    ) {
        this.room = room;
        this.user = user;
        this.quiz = quiz;
    }

    participate(user: IUser) {
        this.participants.push({
            answers: [],
            final_score: 0,
            student: user,
            number_of_correct_answers: 0
        });
        return this;
    }
}