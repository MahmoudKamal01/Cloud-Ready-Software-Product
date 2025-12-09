import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(request: NextRequest): Promise<IUser | null> {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    await import('@/lib/mongodb').then((module) => module.default());
    const user = await User.findById(payload.userId);
    return user;
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: (req: any, user: IUser) => Promise<Response>) {
  return async (req: any): Promise<Response> => {
    const user = await getCurrentUser(req);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(req, user);
  };
}

export function requireRole(allowedRoles: string[]) {
  return (handler: (req: any, user: IUser) => Promise<Response>) => {
    return async (req: any): Promise<Response> => {
      const user = await getCurrentUser(req);
      
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return handler(req, user);
    };
  };
}


