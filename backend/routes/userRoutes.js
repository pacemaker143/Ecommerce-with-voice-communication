const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddlware');

const router = express.Router();

//@route   POST /api/users/register
//@desc    Register a new user
//@access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }   
        const user = new User({ name, email, password });
        await user.save();


        //create jsonwebtoken payload 
        const payload = { id: user._id, role: user.role };
        //sign and return token along with user data
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });


    } catch (error) {
        console.error("Register error:", error);
        res.status(500).send({ message: 'Server error', error: error.message });
    }   
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;   
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }   
        //create jsonwebtoken payload
        const payload = { id: user._id, role: user.role };  
        //sign and return token along with user data
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: 'Server error', error: error.message });
    }
});



// @route   Get /api/users/profile
// @desc    Get logged in users profile
// @access  Private

router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});


module.exports = router;