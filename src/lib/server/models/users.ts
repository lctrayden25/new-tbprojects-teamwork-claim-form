import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    tbId: { type: String, required: true, unique: true },
}, {
    timestamps: true,
    version: false
});

export const User = mongoose.models.User ?? mongoose.model('User', userSchema);