import express from "express";
import {getSchedules, postSchedule } from "../controllers/scheduleController.js";
import login from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/login', login)
router.get('/schedule', getSchedules)
router.post('/schedule', authMiddleware, postSchedule)



export default router;