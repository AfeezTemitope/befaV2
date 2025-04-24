import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import apiRoutes from './route/api.js';
import { connectDB, getRedisClient } from './config/database.js';
import { seedAdmin } from './scripts/seedAdmin.js';
import * as path from 'node:path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import fs from 'node:fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startApp = async () => {
    try {
        await connectDB();
        const redisClient = getRedisClient();
        await seedAdmin();

        app.use(cors());
        app.use(express.json());

        app.use('/api', apiRoutes);

        const staticPath = path.join(__dirname, '..', 'client', 'dist');
        app.use(express.static(staticPath));

        const indexPath = path.join(staticPath, 'index.html');
        app.get('*', (req, res, next) => {
            if (!fs.existsSync(indexPath)) {
                return next(new Error('index.html not found in client/dist'));
            }
            res.sendFile(indexPath);
        });

        app.use((err, req, res, next) => {
            res.status(500).json({ message: err.message || 'Server error' });
        });

        const server = app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });

        process.on('SIGTERM', async () => {
            server.close();
            await mongoose.connection.close();
            await redisClient.quit();
            process.exit(0);
        });
    } catch (e) {
        console.error('App start failed:', e.message);
        process.exit(1);
    }
};

startApp();