import { Router } from 'express';
import { UserRepository } from '../repositories/userRepository.ts';
import { hashPassword, verifyPassword } from '../utils/password.ts';
import { generateToken } from '../utils/jwt.ts';
import type { CreateUserRequest } from '../types/database.ts';
import pino from 'pino'

const logger = pino();
const router = Router();

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password }: CreateUserRequest = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Create user
    const user = await UserRepository.create({
      username,
      email,
      password: passwordHash
    });

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error: any) {
    logger.error(error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        error: 'Conflict',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create user'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await UserRepository.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'Invalid email or password'
      });
    }

    // Verify password
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    // Return user data (without password) and token
    const { password_hash, ...userData } = user;
    
    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to login'
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid user ID'
      });
    }

    const user = await UserRepository.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({ user });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user'
    });
  }
});

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await UserRepository.findAll();
    res.json({ users });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch users'
    });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid user ID'
      });
    }

    const updates = req.body;
    
    // Remove sensitive fields from updates
    delete updates.password_hash;
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;

    // Hash password if provided
    if (updates.password) {
      updates.password = hashPassword(updates.password);
    }

    const user = await UserRepository.update(userId, updates);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error: any) {
    logger.error(error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        error: 'Conflict',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user'
    });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid user ID'
      });
    }

    const deleted = await UserRepository.delete(userId);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete user'
    });
  }
});

export default router;
