import mongoose from "mongoose";
import isValidEmail from "../emailValidator";

const userSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['student', 'professor'],
        required: [true, 'User type is required']
    },
    email: {
        type: String,
        validate: {
            validator: isValidEmail,
            message: '{VALUE} is not a valid email',
        },
        required: [true, 'Email is required'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
    },
    course: String || null,
    section: String || null,
});

export default userSchema;