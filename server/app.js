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
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('MongoDB connected');

        // Connect to Redis
        console.log('Connecting to Redis...');
        const redisClient = getRedisClient();
        await redisClient.ping();
        console.log('Redis connected');

        // Seed admin
        console.log('Seeding admin user...');
        await seedAdmin();
        console.log('Admin user seeded');

        // CORS configuration
        const corsOptions = {
            origin: process.env.NODE_ENV === 'production'
                ? ['https://befav2.onrender.com/']
                : ['http://localhost:5173', 'http://localhost:5000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        };
        app.use(cors(corsOptions));

        // Middleware
        app.use(express.json());

        // API routes
        console.log('Mounting API routes at /api');
        app.use('/api', apiRoutes);

        // Serve static frontend
        const staticPath = path.join(__dirname, '..', 'client', 'dist');
        if (!fs.existsSync(staticPath)) {
            console.error('Static path not found:', staticPath);
        }
        app.use(express.static(staticPath));

        // SPA routing
        const indexPath = path.join(staticPath, 'index.html');
        app.get('*', (req, res, next) => {
            if (!fs.existsSync(indexPath)) {
                console.error('index.html not found at:', indexPath);
                return res.status(500).json({ message: 'Frontend build not found. Please run npm run build.' });
            }
            res.sendFile(indexPath);
        });

        // Error handling
        app.use((err, req, res, next) => {
            console.error('Server error:', err.message);
            res.status(500).json({ message: err.message || 'Server error' });
        });

        // Start server
        const server = app.listen(port, () => {
            console.log(`Server started at port ${port}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received. Shutting down...');
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