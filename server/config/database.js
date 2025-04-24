import redis from 'redis';
import mongoose from 'mongoose';

let redisClient;
let isRedisReady = false;

export const connectDB = async () => {
    try {
        // MongoDB Connection
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        // Redis Connection
        redisClient = redis.createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.error('Too many Redis reconnect attempts. Giving up.');
                        return new Error('Too many retries.');
                    }
                    console.log(`Reconnecting to Redis (attempt ${retries + 1})...`);
                    return 2000; // Reconnect after 2 seconds
                },
            },
        });

        // Log Redis client creation
        console.log('Redis client created:', !!redisClient);

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err.message);
            isRedisReady = false; // Mark Redis as disconnected
            // Do NOT exit the process; let reconnect strategy handle it
        });

        redisClient.on('connect', () => console.log('Redis connecting...'));
        redisClient.on('ready', () => {
            console.log('Redis connected!');
            isRedisReady = true; // Mark Redis as ready
        });

        redisClient.on('end', () => {
            console.log('Redis connection closed.');
            isRedisReady = false; // Mark Redis as disconnected
        });

        // Connect to Redis
        await redisClient.connect();
        console.log('Redis connection verified');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1); // Exit only if initial connection fails
    }
};

export const getRedisClient = () => {
    if (!redisClient) {
        console.log('Redis client is undefined');
        throw new Error('Redis client not initialized');
    }

    if (!isRedisReady) {
        console.log('Redis client is not connected');
        throw new Error('Redis client not connected');
    }

    console.log('Redis client is ready');
    return redisClient;
};