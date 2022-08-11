import mongoose from 'mongoose';
import userSchema from 'entities/user.entity';
import quizSchema from 'entities/quiz.entity';
import questionSchema from 'entities/question.entity';
import quizParticipantSchema from 'entities/quiz-participant.entity';

let database: typeof mongoose | null = null;

export default async function connectToDatabase(): Promise<typeof mongoose | null> {
    try {
        if (database) {
            return database;
        }
        mongoose.model('User', userSchema);
        mongoose.model('Quiz', quizSchema);
        mongoose.model('Question', questionSchema);
        mongoose.model('QuizParticipant', quizParticipantSchema);
        const connection = await mongoose.connect(process.env.MONGODB_URI || '');

        database = connection;
        console.log('connection created');

        return database;
    } catch (error) {
        console.error('Can not connect to database', error);
        return null;
    }
}