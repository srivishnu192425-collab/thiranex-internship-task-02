const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'thiranex_internship_task02_secret_key_2026';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields (name, email, password)'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5,06b6d4,10b981,f59e0b`;

      const newUser = await User.create({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        avatar
      });

      const token = generateToken(newUser.id);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both email and password'
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user.id);

      const userProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        created_at: user.created_at
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userProfile,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
