const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middlewares/auth');
require('dotenv').config();

const router = express.Router();

// Register a user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login a user
// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.status === 'blocked') {
            return res.status(403).json({ message: 'User is blocked' }); // Include a clear message
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await user.update({ last_login: new Date() });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Get all users (sorted by last login)
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.findAll({ order: [['last_login', 'DESC']] });
        res.json(users);
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Block users
router.post('/block', auth, async (req, res) => {
    try {
        const { userIds } = req.body;
        await User.update({ status: 'blocked' }, { where: { id: userIds } });
        res.json({ message: 'Users blocked successfully' });
    } catch (error) {
        console.error('Block users error:', error);
        res.status(500).json({ message: 'Error blocking users' });
    }
});

// Unblock users
router.post('/unblock', auth, async (req, res) => {
    try {
        const { userIds } = req.body;
        await User.update({ status: 'active' }, { where: { id: userIds } });
        res.json({ message: 'Users unblocked successfully' });
    } catch (error) {
        console.error('Unblock users error:', error);
        res.status(500).json({ message: 'Error unblocking users' });
    }
});

// Delete users
router.delete('/delete', auth, async (req, res) => {
    try {
        const { userIds } = req.body;
        await User.destroy({ where: { id: userIds } });
        res.json({ message: 'Users deleted successfully' });
    } catch (error) {
        console.error('Delete users error:', error);
        res.status(500).json({ message: 'Error deleting users' });
    }
});

module.exports = router;
