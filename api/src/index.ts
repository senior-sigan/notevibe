import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino'
import pinoHttp from 'pino-http'
import { testConnection } from './config/database.ts';
import { runMigrations } from './database/migrations.ts';
import routes from './routes/index.ts';

const logger = pino();

const app = express();
const PORT = process.env['PORT'] || 4000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(pinoHttp({ logger })); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env['NODE_ENV'] === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize database and start server
const initializeServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Run migrations
    await runMigrations();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
      logger.info(`🔗 API endpoint: http://localhost:${PORT}/api`);
      logger.info(`🗄️  Database: PostgreSQL connected successfully`);
    });
  } catch (err) {
    logger.error({ err }, '❌ Failed to initialize server');
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
initializeServer();

export default app;