// Environment variables singleton
// Centralized access to all environment variables with validation
// SERVER-ONLY: This file should only be imported in server components/API routes

/**
 * Get admin password from environment
 * @throws Error if not set
 */
export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.trim() === '') {
    throw new Error('ADMIN_PASSWORD environment variable is not set');
  }
  return password;
}

/**
 * Get session secret from environment
 * @throws Error if not set or invalid
 */
export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  if (secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters');
  }
  return secret;
}

/**
 * Get session duration from environment
 * @throws Error if not set or invalid
 */
export function getSessionDuration(): number {
  const duration = process.env.SESSION_DURATION;
  if (!duration || duration.trim() === '') {
    throw new Error('SESSION_DURATION environment variable is not set');
  }
  const parsed = parseInt(duration, 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error('SESSION_DURATION must be a positive number');
  }
  return parsed;
}

/**
 * Get admin user ID from environment (optional)
 * @returns User ID or undefined if not set
 */
export function getAdminUserId(): string | undefined {
  return process.env.ADMIN_USER_ID;
}

/**
 * Validate all required environment variables
 * @throws Error if any required variables are missing or invalid
 */
export function validateEnvironment(): void {
  const errors: string[] = [];

  try {
    getAdminPassword();
  } catch (error) {
    errors.push((error as Error).message);
  }

  try {
    getSessionSecret();
  } catch (error) {
    errors.push((error as Error).message);
  }

  try {
    getSessionDuration();
  } catch (error) {
    errors.push((error as Error).message);
  }

  // Validate password strength (warning only)
  try {
    const password = getAdminPassword();
    if (password.length < 12) {
      console.warn('WARNING: ADMIN_PASSWORD is less than 12 characters. Consider using a stronger password.');
    }
  } catch {
    // Already handled above
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
}

