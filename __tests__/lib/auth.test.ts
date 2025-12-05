import { generateToken, verifyToken } from '@/lib/auth';

// Mock User model to avoid MongoDB dependencies
jest.mock('@/models/User');

describe('Auth Utilities', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const mockUser = {
        _id: { toString: () => '123' },
        email: 'test@example.com',
        role: 'user',
      };

      const token = generateToken(mockUser as any);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const mockUser = {
        _id: { toString: () => '123' },
        email: 'test@example.com',
        role: 'user',
      };

      const token = generateToken(mockUser as any);
      const payload = verifyToken(token);

      expect(payload).toBeDefined();
      expect(payload?.userId).toBe('123');
      expect(payload?.email).toBe('test@example.com');
      expect(payload?.role).toBe('user');
    });

    it('should return null for invalid token', () => {
      const payload = verifyToken('invalid-token');
      expect(payload).toBeNull();
    });

    it('should return null for empty token', () => {
      const payload = verifyToken('');
      expect(payload).toBeNull();
    });

    it('should return null for malformed token', () => {
      const payload = verifyToken('not.a.real.jwt.token');
      expect(payload).toBeNull();
    });
  });
});
