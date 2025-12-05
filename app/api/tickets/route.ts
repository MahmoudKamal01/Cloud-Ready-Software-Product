import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { IUser } from '@/models/User';

const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.string().min(1, 'Category is required'),
  assignedTo: z.string().optional(),
});

// GET /api/tickets - Get all tickets (with filters)
async function getTickets(req: NextRequest, user: IUser) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assignedTo');
    const createdBy = searchParams.get('createdBy');

    const filter: any = {};

    // Regular users can only see their own tickets
    if (user.role === 'user') {
      filter.createdBy = user._id;
    } else if (createdBy) {
      filter.createdBy = createdBy;
    }

    // Agents and admins can filter by assigned tickets
    if (assignedTo && (user.role === 'agent' || user.role === 'admin')) {
      filter.assignedTo = assignedTo;
    } else if (user.role === 'agent' && !assignedTo) {
      // Agents see tickets assigned to them or unassigned
      filter.$or = [
        { assignedTo: user._id },
        { assignedTo: null },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create a new ticket
async function createTicket(req: NextRequest, user: IUser) {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = ticketSchema.parse(body);

    const ticket = await Ticket.create({
      ...validatedData,
      createdBy: user._id,
      assignedTo: validatedData.assignedTo || undefined,
    });

    await ticket.populate('createdBy', 'name email');
    if (ticket.assignedTo) {
      await ticket.populate('assignedTo', 'name email');
    }

    return NextResponse.json(
      { message: 'Ticket created successfully', ticket },
      { status: 201 }
    );
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

export const GET = requireAuth(getTickets);
export const POST = requireAuth(createTicket);

