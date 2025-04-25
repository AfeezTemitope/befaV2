import cacheService from '../services/cacheService.js';
import Player from '../models/player.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const postPlayerOfTheMonth = async (req, res) => {
    try {
        const { name, position, description, strengths, captions } = req.body;
        const files = req.files; // Files from multer

        // Validate required fields
        if (!name || !position || !description || !strengths || !files) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate image count (3–10)
        if (!Array.isArray(files) || files.length < 3 || files.length > 10) {
            return res.status(400).json({
                message: 'Player must have between 3 and 10 images',
            });
        }

        // Parse captions (array or JSON string)
        let parsedCaptions;
        try {
            parsedCaptions = typeof captions === 'string' ? JSON.parse(captions) : captions;
        } catch (error) {
            return res.status(400).json({ message: 'Invalid captions format' });
        }

        // Validate captions length matches files
        if (!Array.isArray(parsedCaptions) || parsedCaptions.length !== files.length) {
            return res.status(400).json({ message: 'Captions must match the number of images' });
        }

        // Check Cloudinary configuration
        if (!cloudinary.config().cloud_name) {
            throw new Error('Cloudinary configuration is missing or invalid');
        }

        // Handle image uploads to Cloudinary
        const uploadedImages = await Promise.all(
            files.map(async (file, index) => {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'befav2/players',
                        public_id: `${name.replace(/\s+/g, '_')}_${index}_${Date.now()}`,
                    });
                    // Delete temporary file
                    fs.unlinkSync(file.path);
                    return { url: result.secure_url, caption: parsedCaptions[index] || '' };
                } catch (uploadError) {
                    throw new Error(`Failed to upload image ${index + 1}: ${uploadError.message}`);
                }
            })
        );

        // Parse strengths
        let parsedStrengths;
        try {
            parsedStrengths = typeof strengths === 'string' ? JSON.parse(strengths) : strengths;
        } catch (error) {
            return res.status(400).json({ message: 'Invalid strengths format' });
        }
        if (!Array.isArray(parsedStrengths) || parsedStrengths.length === 0) {
            return res.status(400).json({ message: 'Strengths must be a non-empty array' });
        }

        // Delete existing Player of the Month
        await Player.deleteMany({ isPlayerOfTheMonth: true });

        // Create new player
        const player = new Player({
            name,
            position,
            images: uploadedImages,
            description,
            strengths: parsedStrengths,
            isPlayerOfTheMonth: true,
        });

        const savedPlayer = await player.save();

        // Update Redis cache
        const cacheKey = 'playerOfTheMonth';
        await cacheService.del(cacheKey); // Clear stale cache
        await cacheService.set(cacheKey, JSON.stringify(savedPlayer), 3600);

        res.status(201).json(savedPlayer);
    } catch (error) {
        console.error('Post player error:', error.message);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};


export const getPlayerOfTheMonth = async (req, res) => {
    try {
        const cacheKey = 'playerOfTheMonth';
        const cachedPlayer = await cacheService.get(cacheKey);

        if (cachedPlayer) {
            console.log('Serving Player of the Month from Redis cache');
            return res.status(200).json(JSON.parse(cachedPlayer));
        }

        const player = await Player.findOne({ isPlayerOfTheMonth: true }).lean();
        if (!player) {
            return res.status(404).json({ message: 'No Player of the Month found' });
        }

        await cacheService.set(cacheKey, JSON.stringify(player), 3600);
        console.log('Fetched Player of the Month from MongoDB:', player);
        res.status(200).json(player);
    } catch (error) {
        console.error('Get player error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


