// Utility functions for the application

/**
 * Generate a random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize string input
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Format date to ISO string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Create API response
 */
export const createApiResponse = <T>(
  success: boolean, 
  data?: T, 
  error?: string, 
  message?: string
) => {
  return {
    success,
    ...(data && { data }),
    ...(error && { error }),
    ...(message && { message })
  };
};

/**
 * Validate required fields
 */
export const validateRequiredFields = (obj: any, requiredFields: string[]): string[] => {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!obj[field] || obj[field].toString().trim() === '') {
      missingFields.push(field);
    }
  }
  
  return missingFields;
};