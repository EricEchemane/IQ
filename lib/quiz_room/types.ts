import { IUser } from "entities/user.entity";
import { NextApiResponse } from "next";

export class QuizRoom {
    hostId: string;
    participants: IUser[] = [];
    constructor(hostId: string) {
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