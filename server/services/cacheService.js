import { getRedisClient } from '../config/database.js';

const get = async (key) => {
    try {
        const redisClient = getRedisClient();
        return await redisClient.get(key);
    } catch (error) {
        console.error(`Redis get failed for key ${key}:`, error.message);
        return null; // Fallback to database or other logic
    }
};

const set = async (key, value, ttl) => {
    try {
        const redisClient = getRedisClient();
        return await redisClient.setEx(key, ttl, value);
    } catch (error) {
        console.error(`Redis set failed for key ${key}:`, error.message);
        return false; // Indicate failure
    }
};

const del = async (key) => {
    try {
        const redisClient = getRedisClient();
        return await redisClient.del(key);
    } catch (error) {
        console.error(`Redis delete failed for key ${key}:`, error.message);
        return false; // Indicate failure
    }
};

export default { get, set, del };