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
        if (!mongoose.models.User) mongoose.model('User', userSchema);
        if (!mongoose.models.Quiz) mongoose.model('Quiz', quizSchema);
        if (!mongoose.models.Question) mongoose.model('Question', questionSchema);
        if (!mongoose.models.QuizParticipant) mongoose.model('QuizParticipant', quizParticipantSchema);
        const connection = await mongoose.connect(process.env.MONGODB_URI || '');

        database = connection;
        console.log('connection created');

        return database;
    } catch (error) {
        console.error('Can not connect to database', error);
        return null;
    }
}