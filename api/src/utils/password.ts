import crypto from 'crypto';

/**
 * Hash a password using SHA-256
 * In production, you should use bcrypt or argon2 for better security
 */
export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * Verify a password against its hash
 */
export const verifyPassword = (password: string, hash: string): boolean => {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
};

/**
 * Generate a random salt (for future bcrypt implementation)
 */
export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex');
};
