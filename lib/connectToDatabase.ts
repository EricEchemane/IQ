import mongoose from 'mongoose';

let mongoConnection: typeof mongoose | null = null;

export default async function connectToDatabase() {
    try {
        if (mongoConnection) {
            return mongoConnection;
        }
        mongoConnection = await mongoose.connect(process.env.MONGO_URI || '');
        return mongoConnection;
    } catch (error) {
        console.error('Can not connect to database', error);
        return null;
    }
}