import mongoose from "mongoose";
import isValidEmail from "lib/emailValidator";

export enum EUserType {
    student = 'student',
    professor = 'professor',
}
export interface IUser {
    _id?: string;
    type: EUserType;
    email: string;
    name: string;
    image: string;
    program: string;
    section: string;
    year: string;
}

const userSchema = new mongoose.Schema<IUser>({
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
    image: String,
    program: String || null,
    section: String || null,
    year: String || null,
});

export default userSchema;