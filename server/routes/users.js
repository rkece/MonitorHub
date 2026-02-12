const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: String,
    avatar: String,
    loginTime: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);


// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().sort({ lastLogin: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create or update user on login
router.post("/login", async (req, res) => {
    const { email, name, avatar } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            user.lastLogin = new Date();
            user.name = name || user.name;
            user.avatar = avatar || user.avatar;
            await user.save();
        } else {
            user = await User.create({ email, name, avatar });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
