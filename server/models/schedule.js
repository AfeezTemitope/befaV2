import mongoose from "mongoose";
const scheduleSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    day: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    coach: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Schedule', scheduleSchema);