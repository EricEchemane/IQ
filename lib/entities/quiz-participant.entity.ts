import mongoose from "mongoose";

const quizParticipantSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    final_score: {
        type: Number,
        default: 0,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
    },
    date_finished: {
        type: Date,
    },
    answers: {
        type: [String]
    }
});

export default mongoose.model("QuizParticipant", quizParticipantSchema);