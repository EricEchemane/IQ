import { IQuestion } from 'entities/question.entity';
import { IQuiz } from "entities/quiz.entity";
import { IUser } from "entities/user.entity";
import { participant } from './types';

export class QuizRoom {
    room: string;
    user: IUser;
    quiz: IQuiz;
    participants: participant[] = [];
    isStarted: boolean = false;
    stopped: boolean = false;
    isEnded: boolean = false;
    currentIndexOfQuestion: number = -1; // -1 means not yet started
    currentQuestion: IQuestion | undefined;

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
        this.currentIndexOfQuestion = 0;
        this.currentQuestion = this.quiz.questions[0];
    }
    stop() {
        this.isStarted = false;
        this.stopped = true;
    }
    next() {
        if (this.currentIndexOfQuestion + 1 === this.quiz.questions.length) {
            throw new Error("No more questions");
        }
        this.currentIndexOfQuestion = this.currentIndexOfQuestion + 1;
        this.currentQuestion = this.quiz.questions[this.currentIndexOfQuestion];
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
        // return the index of the participant
        return this.participants.length - 1;
    }

    getParticipant(socketId: string): participant | undefined {
        return this.participants.find(p => p.socketId === socketId);
    }

    removeParticipant(email: string) {
        this.participants = this.participants.filter(p => p.student.email !== email);
    }
}