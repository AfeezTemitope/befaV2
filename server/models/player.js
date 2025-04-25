import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    images: [
        {
            url: { type: String, required: true },
            caption: { type: String },
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        },
    ],
    description: { type: String, required: true },
    strengths: [{ type: String }],
    isPlayerOfTheMonth: { type: Boolean, default: false },
});

const Player = mongoose.model('Player', playerSchema);
export default Player;