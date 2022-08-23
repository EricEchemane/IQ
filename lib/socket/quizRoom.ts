import { IQuestion } from 'entities/question.entity';
import { IQuiz } from "entities/quiz.entity";
import { IUser } from "entities/user.entity";
import { participant, submitAnswerPayload } from './types';

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

    participate(user: IUser) {
        const isPresent = this.participants.find(p => p.student._id === user._id);
        if (isPresent) return;

        this.participants.push({
            answers: [],
            final_score: 0,
            number_of_correct_answers: 0,
            student: user
        });
        // return the index of the participant
        return this.participants.length - 1;
    }

    getParticipant(userid: string): participant | undefined {
        return this.participants.find(p => p.student._id === userid);
    }

    removeParticipant(email: string) {
        this.participants = this.participants.filter(p => p.student.email !== email);
    }

    submitAnswer(payload: submitAnswerPayload) {
        const participant = this.getParticipant(payload.userId);
        if (!participant) return;

        if (participant.answers.length !== this.currentIndexOfQuestion) return;

        participant.answers.push(payload.answer);
        if (payload.isCorrect) {
            participant.number_of_correct_answers = participant.number_of_correct_answers + 1;
            participant.final_score = participant.final_score + (this.currentQuestion?.points || 1);
        }
        return participant;
    }

    sortPartcipantsByScore() {
        if (!this.isEnded) throw new Error("Quiz is not yet finished");

        this.participants.sort((a, b) => {
            return b.final_score - a.final_score;
        });
    }
}