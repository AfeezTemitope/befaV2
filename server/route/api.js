import express from 'express';
import { getSchedules, postSchedule } from '../controllers/scheduleController.js';
import login from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getPlayerOfTheMonth, postPlayerOfTheMonth } from '../controllers/playerController.js';
import multer from 'multer';

// Multer configuration with memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, or GIF images are allowed'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).array('images', 10);

// Wrap multer middleware to handle errors
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

const router = express.Router();

router.post('/login', login);
router.get('/schedule', getSchedules);
router.post('/schedule', authMiddleware, postSchedule);
router.get('/playerOfTheMonth', getPlayerOfTheMonth);
router.post('/playerOfTheMonth', authMiddleware, uploadMiddleware, postPlayerOfTheMonth);

export default router;