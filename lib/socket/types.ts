import { ProfessorAction } from './../../state_providers/professor/index';
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
export type joinRoomPayload = {
    room: string;
    user: IUser;
};

export interface ServerEvents {
    "participant:joined": (quizRoom: QuizRoom) => void;
    "participant:leave": (quizRoom: QuizRoom) => void;
    "room:destroyed": (room: string) => void;
    "quiz:started": (quizRoom: QuizRoom) => void;
}

export interface ClientEvents {
    "create:room": (
        payload: createRoomPayload,
        callback: (err: any, data: any) => void
    ) => void;
    "join:room": (
        payload: joinRoomPayload,
        callback: (err: any, data: any) => void
    ) => void;
    "destroy:room": (
        room: string,
        callback: (err: any, data: any) => void
    ) => void;
    "start:quiz": (
        room: string,
        callback: (err: any, data: any) => void
    ) => void;
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

export class QuizRoom {
    room: string;
    user: IUser;
    quiz: IQuiz;
    participants: participant[] = [];
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

    start() {
        this.isStarted = true;
    }

    participate(socketId: string, user: IUser) {
        const isPresent = this.participants.find(p => p.student.email === user.email);
        if (isPresent) return;

        this.participants.push({
            answers: [],
            final_score: 0,
            number_of_correct_answers: 0,
            student: user,
            socketId
        });
        return this;
    }

    getParticipant(socketId: string): participant | undefined {
        return this.participants.find(p => p.socketId === socketId);
    }

    removeParticipant(email: string) {
        this.participants = this.participants.filter(p => p.student.email !== email);
    }
}