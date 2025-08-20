import { Router } from 'express';

const router = Router();

// Import route modules (will be created later)
// import authRoutes from './auth';
// import notesRoutes from './notes';
// import usersRoutes from './users';

// Mount routes
// router.use('/auth', authRoutes);
// router.use('/notes', notesRoutes);
// router.use('/users', usersRoutes);

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