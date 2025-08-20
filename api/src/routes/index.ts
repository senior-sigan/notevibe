import { Router } from 'express';
import usersRoutes from './users';
import notesRoutes from './notes';

const router = Router();

// Mount routes
router.use('/users', usersRoutes);
router.use('/notes', notesRoutes);

// Base API route
router.get('/', (req, res) => {
  res.json({
    message: 'Notes API v1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      notes: '/notes',
      users: '/users'
    }
  });
});

export default router;