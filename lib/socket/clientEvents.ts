import { QuizRoom } from "./quizRoom";
import { createRoomPayload, joinRoomPayload } from "./types";

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
    "quiz:stop": (
        room: string,
        callback: (err: any, data: any) => void
    ) => void;
    "timer:change": (count: number, room: string) => void;
    "next:question": (
        room: string,
        callback: (err: any, data: QuizRoom) => void
    ) => void;
}