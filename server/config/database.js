import mongoose from "mongoose";
import * as redis from "redis";

let redisClient;

const connectDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        // Connect to Redis
        redisClient = redis.createClient({
            url: process.env.REDIS_URL,
        });

        redisClient.on('error', (err) => console.error('Redis Client Error', err));

        await redisClient.connect();
        console.log('Redis connected');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Export Redis client for use in cacheService
const getRedisClient = () => redisClient;

module.exports = { connectDB, getRedisClient };