import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
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
            validator: (value: String) => {
                return value.length > 0;
            },
            message: 'Requires atleast one section as the participant',
        }
    }
});

export default mongoose.model("Quiz", quizSchema);