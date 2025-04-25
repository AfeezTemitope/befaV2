import express from "express";
import { getSchedules, postSchedule } from "../controllers/scheduleController.js";
import login from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPlayerOfTheMonth, postPlayerOfTheMonth } from "../controllers/playerController.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, or GIF images are allowed'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();

router.post('/login', login);
router.get('/schedule', getSchedules);
router.post('/schedule', authMiddleware, postSchedule);
router.get('/playerOfTheMonth', getPlayerOfTheMonth);
router.post('/playerOfTheMonth', authMiddleware, upload.array('images', 10), postPlayerOfTheMonth);

export default router;