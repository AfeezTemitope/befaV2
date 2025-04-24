import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.status(200).json({ user: { email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export default login;