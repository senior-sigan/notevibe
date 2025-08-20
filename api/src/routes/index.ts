import { Router } from 'express';
import usersRoutes from './users.ts';
import notesRoutes from './notes.ts';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount routes
router.use('/users', usersRoutes);
router.use('/notes', notesRoutes);

// Base API route
router.get('/', (req, res) => {
  res.json({
    message: 'Notes API v1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      notes: '/api/notes',
      users: '/api/users'
    }
  });
});

export default router;