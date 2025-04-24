import mongoose from "mongoose";
const scheduleSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    time: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Matches HH:MM (24-hour)
    },
    jerseyColor: {
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
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;