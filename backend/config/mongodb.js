import mongoose from "mongoose";

const connectBD = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB || 'medi-book-pro';

        if (!uri) {
            console.error('MONGODB_URI is not set in environment variables.');
            return;
        }

        mongoose.connection.on('connected', () => console.log('Database connected'));
        mongoose.connection.on('error', (err) => console.error('Mongo connection error:', err.message));
        mongoose.connection.on('disconnected', () => console.warn('Mongo disconnected'));

        await mongoose.connect(uri, { dbName });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
    }
};

export default connectBD

