import { NextApiResponse } from "next";

export enum ProfessorEvents {
    join_quiz_room = 'join_quiz_room'
}

export enum StudentEvents {
    student_join_quiz_room = 'student_join_quiz_room'
}

export enum RoomExceptions {
    not_a_professor = 'not_a_professor'
}

export enum Room {
    joined = 'joined'
}

export type SocketRes = NextApiResponse & {
    socket: {
        server: any;
    };
};