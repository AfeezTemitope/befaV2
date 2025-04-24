import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
        }

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log(`Admin user already exists: ${existingAdmin.email}`);
            return;
        }

        const admin = new User({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin',
        });
        await admin.save();
        console.log(`Admin user created successfully: ${ADMIN_EMAIL}`);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        throw error;
    }
};

export { seedAdmin };