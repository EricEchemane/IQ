import mongoose from "mongoose";

export interface IQuestion {
    question: string;
    timer: number | "inherit";
    choices: string[];
    correct_choice: string;
    points?: number;
}

const questionSchema = new mongoose.Schema<IQuestion>({
    question: {
        type: String,
        required: [true, 'Question is required'],
        minlength: [5, 'Question must be at least 3 characters long'],
    },
    timer: { // in seconds: default to inherit from quiz
        type: Number || 'inherit',
        default: 'inherit',
    },
    choices: {
        type: [String],
        required: [true, 'Choices are required'],
        validate: {
            validator: (value: String[]) => {
                return value.length >= 2;
            },
            message: 'Requires atleast two choices',
        }
    },
    correct_choice: {
        type: String,
        required: [true, 'Correct choice is required'],
    },
    points: {
        type: Number,
        default: 1,
        min: [1, 'Points must be at least 1'],
    }
});

export default questionSchema;