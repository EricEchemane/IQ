import mongoose from "mongoose";

export interface IQuiz extends mongoose.Document {
    title: string;
    code: string;
    author: mongoose.Schema.Types.ObjectId;
    date_created: Date;
    questions: mongoose.Schema.Types.ObjectId[];
    forSections: string[];
    default_question_timer?: 5;
    participants?: mongoose.Schema.Types.ObjectId[];
}

const quizSchema = new mongoose.Schema<IQuiz>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Title must be at least 3 characters long'],
    },
    code: {
        type: String,
        required: [true, 'Code is required'],
        length: [6, 'Code must be at least 6 characters long'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date_created: {
        type: Date,
        default: Date.now,
    },
    questions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Question',
    },
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'QuizParticipant',
    },
    default_question_timer: { // seconds
        type: Number,
        default: 5,
    },
    forSections: {
        type: [String],
        validate: {
            validator: (value: String[]) => {
                return value.length > 0;
            },
            message: 'Requires atleast one section as the participant',
        }
    }
});

export default quizSchema;