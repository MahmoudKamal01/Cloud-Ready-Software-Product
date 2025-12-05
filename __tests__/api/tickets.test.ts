import { GET as getTicketsHandler, POST as createTicketHandler } from '@/app/api/tickets/route';
import Ticket from '@/models/Ticket';
import { getCurrentUser } from '@/lib/auth';

// Mock dependencies
jest.mock('@/lib/mongodb');
jest.mock('@/models/Ticket');
jest.mock('@/lib/auth');

describe('Tickets API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tickets', () => {
    it('should return tickets for authenticated user', async () => {
      const mockUser = {
        _id: '123',
        role: 'user',
      };

      const mockTickets = [
        {
          _id: '1',
          title: 'Test Ticket',
          description: 'Test Description',
          status: 'open',
          priority: 'medium',
          createdBy: { name: 'User', email: 'user@example.com' },
        },
      ];

      (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (Ticket.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockTickets),
          }),
        }),
      });

      const request = new Request('http://localhost/api/tickets');
      const response = await getTicketsHandler(request, mockUser);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tickets).toHaveLength(1);
    });

    it('should filter tickets by status', async () => {
      const mockUser = {
        _id: '123',
        role: 'user',
      };

      (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (Ticket.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/tickets?status=open');
      await getTicketsHandler(request, mockUser);

      expect(Ticket.find).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'open' })
      );
    });
  });

  describe('POST /api/tickets', () => {
    it('should create a new ticket', async () => {
      const mockUser = {
        _id: '123',
        role: 'user',
      };

      const mockTicket = {
        _id: '1',
        title: 'New Ticket',
        description: 'Description',
        status: 'open',
        priority: 'medium',
        category: 'Technical',
        createdBy: mockUser._id,
        populate: jest.fn().mockResolvedValue({
          populate: jest.fn().mockResolvedValue({}),
        }),
      };

      (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (Ticket.create as jest.Mock).mockResolvedValue(mockTicket);

      const request = new Request('http://localhost/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Ticket',
          description: 'Description',
          priority: 'medium',
          category: 'Technical',
        }),
      });

      const response = await createTicketHandler(request, mockUser);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Ticket created successfully');
    });

    it('should validate required fields', async () => {
      const mockUser = {
        _id: '123',
        role: 'user',
      };

      (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const request = new Request('http://localhost/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '',
          description: 'Description',
        }),
      });

      const response = await createTicketHandler(request, mockUser);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });
  });
});

