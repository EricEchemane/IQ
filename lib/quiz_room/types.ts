import { IUser } from "entities/user.entity";
import { NextApiResponse } from "next";

export type Participant = IUser & {
    socketId: string;
};

export class QuizRoom {
    quizCode: string;
    hostId: string;
    participants: Participant[] = [];
    constructor(quizCode: string, hostId: string) {
        this.quizCode = quizCode;
        this.hostId = hostId;
    }
}

export enum ProfessorEvents {
    join_quiz_room = 'join_quiz_room'
}

export enum StudentEvents {
    student_join_quiz_room = 'student_join_quiz_room'
}

export enum RoomExceptions {
    not_a_professor = 'not_a_professor',
    room_already_exists = 'room_already_exists',
    room_not_found = 'room_not_found'
}

export enum Room {
    joined = 'joined'
}

export type SocketRes = NextApiResponse & {
    socket: {
        server: any;
    };
};