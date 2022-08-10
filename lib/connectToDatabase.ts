import mongoose from 'mongoose';
import User from 'entities/user.entity';

interface Database {
    connection: typeof mongoose;
    user: typeof User;
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
            user: User
        };

        return database;
    } catch (error) {
        console.error('Can not connect to database', error);
        return null;
    }
}