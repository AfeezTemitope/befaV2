import cacheService from "../services/cacheService"
import Schedule from "../models/schedule.js"

const getSchedules = async (req, res, next) => {
    try {
        const cacheKey = 'schedules';
        const cachedSchedules = await cacheService.get(cacheKey);

        if (cachedSchedules) {
            return res.status(200).json(JSON.parse(cachedSchedules));
        }

        const schedules = await Schedule.find().lean();
        await cacheService.set(cacheKey, JSON.stringify(schedules), 3600);

        res.set('Cache-Control', 'public, max-age=3600');
        res.status(200).json(schedules);
    } catch (error) {
        next(error);
    }
};

module.exports = { getSchedules };