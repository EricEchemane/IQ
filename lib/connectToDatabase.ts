import mongoose from 'mongoose';
import User from 'entities/user.entity';
import Quiz from 'entities/quiz.entity';
import Question from 'entities/question.entity';
import QuizParticipant from 'entities/quiz-participant.entity';


interface Database {
    connection: typeof mongoose;
    user: typeof User;
    quiz: typeof Quiz,
    question: typeof Question,
    quizParticipant: typeof QuizParticipant,
}

let database: Database | null = null;

export default async function connectToDatabase(): Promise<Database | null> {
    try {
        if (database) {
            return database;
        }
        const connection = await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('connection created');

        database = {
            connection,
            user: User,
            quiz: Quiz,
            question: Question,
            quizParticipant: QuizParticipant,
        };

        return database;
    } catch (error) {
        console.error('Can not connect to database', error);
        return null;
    }
}