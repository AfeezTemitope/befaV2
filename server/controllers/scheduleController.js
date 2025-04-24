import cacheService from '../services/cacheService.js';
import Schedule from '../models/schedule.js';

export const getSchedules = async (req, res) => {
    try {
        const cacheKey = 'schedules';
        const cachedSchedules = await cacheService.get(cacheKey);

        if (cachedSchedules) {
            return res.status(200).json(JSON.parse(cachedSchedules));
        }

        const schedules = await Schedule.find().lean();
        await cacheService.set(cacheKey, JSON.stringify(schedules), 3600);
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const postSchedule = async (req, res) => {
    try {
        const schedulesData = Array.isArray(req.body) ? req.body : [req.body];

        // Validate schedule data
        const schedules = schedulesData.map(({ day, time, jerseyColor, location, coach }) => {
            if (!day || !time || !jerseyColor || !location || !coach) {
                throw new Error('Missing required fields in schedule data');
            }
            return new Schedule({ day, time, jerseyColor, location, coach });
        });

        // Delete all existing schedules
        await Schedule.deleteMany({});

        // Save new schedules
        const savedSchedules = await Schedule.insertMany(schedules);

        // Immediately cache the new schedules
        const cacheKey = 'schedules';
        await cacheService.del(cacheKey); // Clear stale cache
        await cacheService.set(cacheKey, JSON.stringify(savedSchedules), 3600);

        res.status(201).json(savedSchedules);
    } catch (error) {
        console.error('Post schedule error:', error.message);
        res.status(400).json({ message: error.message || 'Server error' });
    }
};