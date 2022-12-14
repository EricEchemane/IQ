import mongoose from "mongoose";

export interface IQuizParticipant {
    student: mongoose.Schema.Types.ObjectId;
    quiz: mongoose.Schema.Types.ObjectId;
    date_finished?: Date;
    answers: string[];
    final_score?: number;
    ranking?: number;
}

const quizParticipantSchema = new mongoose.Schema<IQuizParticipant>({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    final_score: {
        type: Number,
        default: 0,
    },
    ranking: {
        type: Number,
        default: 0,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
    },
    date_finished: {
        type: Date,
        default: Date.now,
    },
    answers: {
        type: [String]
    }
});

export default quizParticipantSchema;