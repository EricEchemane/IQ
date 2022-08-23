import { QuizRoom } from "./quizRoom";

export interface ServerEvents {
    "participant:joined": (quizRoom: QuizRoom) => void;
    "participant:leave": (quizRoom: QuizRoom) => void;
    "room:destroyed": (room: string) => void;
    "quiz:started": (quizRoom: QuizRoom) => void;
    "quiz:stopped": (quizRoom: QuizRoom) => void;
    "timer:changed": (count: number) => void;
    "question:next": (quizRoom: QuizRoom) => void;
    "reveal:correct-answer": (answer: string) => void;
    "quiz:saved": (quizRoom: QuizRoom) => void;
}