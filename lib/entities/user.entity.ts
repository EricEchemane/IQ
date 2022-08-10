import mongoose from "mongoose";
import isValidEmail from "../emailValidator";

const userSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['student', 'professor'],
        required: true
    },
    email: {
        type: String,
        validate: {
            validator: isValidEmail,
            message: '{VALUE} is not a valid email',
        },
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: [3, 'Name must be at least 3 characters long'],
    },
    course: {
        type: String || null,
        required: true,
    },
    section: {
        type: String || null,
        required: true,
    }
});

export default mongoose.model('User', userSchema);