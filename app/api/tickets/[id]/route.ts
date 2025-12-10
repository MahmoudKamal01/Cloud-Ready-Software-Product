import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { IUser } from '@/models/User';

const updateTicketSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(['open', 'in-progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.string().min(1).optional(),
  assignedTo: z.string().nullable().optional(),
});

// GET /api/tickets/[id] - Get a specific ticket
async function getTicket(req: NextRequest, user: IUser) {
  try {
    await connectDB();

    const id = req.url.split('/').pop()?.split('?')[0];
    if (!id) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (user.role === 'user' && ticket.createdBy._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ ticket }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/tickets/[id] - Update a ticket
async function updateTicket(req: NextRequest, user: IUser) {
  try {
    await connectDB();

    const id = req.url.split('/').pop()?.split('?')[0];
    if (!id) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (user.role === 'user' && ticket.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = updateTicketSchema.parse(body);

    // Only agents and admins can assign tickets
    if (validatedData.assignedTo !== undefined && user.role === 'user') {
      delete validatedData.assignedTo;
    }

    // Only agents and admins can change status
    if (validatedData.status && user.role === 'user') {
      delete validatedData.status;
    }

    Object.assign(ticket, validatedData);
    await ticket.save();

    await ticket.populate('createdBy', 'name email');
    if (ticket.assignedTo) {
      await ticket.populate('assignedTo', 'name email');
    }

    return NextResponse.json(
      { message: 'Ticket updated successfully', ticket },
      { status: 200 }
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

// DELETE /api/tickets/[id] - Delete a ticket
async function deleteTicket(req: NextRequest, user: IUser) {
  try {
    await connectDB();

    const id = req.url.split('/').pop()?.split('?')[0];
    if (!id) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Only admins or ticket creators can delete
    if (user.role !== 'admin' && ticket.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await Ticket.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Ticket deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getTicket);
export const PUT = requireAuth(updateTicket);
export const DELETE = requireAuth(deleteTicket);



