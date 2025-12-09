import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['user', 'admin', 'agent']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user (role defaults to 'user' unless admin creates)
    const user = await User.create({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      role: validatedData.role || 'user',
    });

    const token = generateToken(user);

    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // Set to false for HTTP, true for HTTPS
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


