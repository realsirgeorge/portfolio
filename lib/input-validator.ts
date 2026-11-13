// Input validation utilities for security
// Implements OWASP Top 10 security best practices

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export class InputValidator {
  /**
   * Validate slug format and prevent path traversal
   */
  static validateSlug(slug: string): ValidationResult {
    // Length check
    if (slug.length < 3 || slug.length > 100) {
      return { valid: false, error: 'Slug must be between 3 and 100 characters' };
    }
    
    // Character set check (only lowercase letters, numbers, and hyphens)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' };
    }
    
    // Path traversal prevention
    if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
      return { valid: false, error: 'Invalid slug format' };
    }
    
    // Reserved names
    const reserved = ['admin', 'api', 'login', 'logout', 'index', 'template', '_template'];
    if (reserved.includes(slug.toLowerCase())) {
      return { valid: false, error: 'Slug is reserved' };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate date format (YYYY-MM-DD)
   */
  static validateDate(date: string): ValidationResult {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
    }
    
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return { valid: false, error: 'Invalid date' };
    }
    
    // Prevent future dates (optional, but good practice)
    if (parsed > new Date()) {
      return { valid: false, error: 'Date cannot be in the future' };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate category value
   */
  static validateCategory(category: string): ValidationResult {
    const validCategories = ['ctf', 'security', 'tutorial', 'network'];
    if (!validCategories.includes(category)) {
      return { valid: false, error: `Category must be one of: ${validCategories.join(', ')}` };
    }
    return { valid: true };
  }
  
  /**
   * Sanitize filename to prevent path traversal and injection
   */
  static sanitizeFilename(filename: string): string {
    // Remove path components
    let sanitized = filename.replace(/^.*[\\\/]/, '');
    
    // Remove special characters (keep only alphanumeric, dots, hyphens)
    sanitized = sanitized.replace(/[^a-z0-9.-]/gi, '');
    
    // Ensure .md extension
    if (!sanitized.endsWith('.md')) {
      sanitized += '.md';
    }
    
    return sanitized.toLowerCase();
  }
  
  /**
   * Validate markdown content structure
   */
  static validateMarkdownContent(content: string): ValidationResult {
    const errors: string[] = [];
    
    // Check for frontmatter
    if (!content.startsWith('---')) {
      errors.push('Missing YAML frontmatter');
    }
    
    // Check for closing frontmatter
    const frontmatterEnd = content.indexOf('\n---\n', 4);
    if (frontmatterEnd === -1) {
      errors.push('Invalid frontmatter format');
    }
    
    // Check content length (prevent DoS)
    if (content.length > 5 * 1024 * 1024) { // 5MB max
      errors.push('Content exceeds maximum size (5MB)');
    }
    
    // Check for suspicious patterns (XSS prevention)
    const suspiciousPatterns = [
      { pattern: /<iframe/i, name: 'iframe tags' },
      { pattern: /<script/i, name: 'script tags' },
      { pattern: /javascript:/i, name: 'javascript: protocol' },
      { pattern: /on\w+\s*=/i, name: 'event handlers' },
    ];
    
    suspiciousPatterns.forEach(({ pattern, name }) => {
      if (pattern.test(content)) {
        errors.push(`Suspicious content detected: ${name}`);
      }
    });
    
    if (errors.length > 0) {
      return { valid: false, error: errors.join('; ') };
    }
    
    return { valid: true };
  }
  
  /**
   * Constant-time string comparison to prevent timing attacks
   */
  static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
}

