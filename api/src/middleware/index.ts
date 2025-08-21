import type { Request, Response, NextFunction } from 'express';
import pino from 'pino'
import { verifyToken, extractTokenFromHeader, type JWTPayload } from '../utils/jwt.ts';

const logger = pino();

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env['NODE_ENV'] === 'development' ? err.message : 'Something went wrong'
  });
};

// Not found middleware
export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
};

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error: any) {
    logger.warn('Authentication failed:', error.message);
    return res.status(401).json({
      error: 'Authentication Error',
      message: error.message || 'Authentication required'
    });
  }
};

// Rate limiting middleware (placeholder)
export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement rate limiting
  logger.warn('Rate limiting middleware - not implemented yet');
  next();
};