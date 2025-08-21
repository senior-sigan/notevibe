import jwt from 'jsonwebtoken';
import pino from 'pino';

const logger = pino();

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '24h';

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
}

export const generateToken = (payload: JWTPayload): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    logger.error('Error verifying JWT token:', error);
    throw new Error('Invalid or expired authentication token');
  }
};

export const extractTokenFromHeader = (authHeader: string | undefined): string => {
  if (!authHeader) {
    throw new Error('Authorization header is required');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header must start with Bearer');
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
};
