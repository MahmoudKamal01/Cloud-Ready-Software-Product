import { generateToken, verifyToken } from '@/lib/auth';
import User from '@/models/User';

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
    });

    it('should return null for invalid token', () => {
      const payload = verifyToken('invalid-token');
      expect(payload).toBeNull();
    });
  });
});

