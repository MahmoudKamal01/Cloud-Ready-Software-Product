'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdBy: { name: string; email: string };
  assignedTo?: { name: string; email: string };
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  const loadTickets = useCallback(async () => {
    try {
      const response = await fetch('/api/tickets', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    loadTickets();
  }, [checkAuth, loadTickets]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ title: '', description: '', priority: 'medium', category: '' });
        loadTickets();
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadTickets();
      }
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#0070f3';
      case 'in-progress': return '#ffa500';
      case 'resolved': return '#28a745';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc3545';
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa500';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>{user?.name} ({user?.role})</span>
          <Link href="/" className="btn btn-secondary">Home</Link>
        </div>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary">
          {showCreateForm ? 'Cancel' : 'Create New Ticket'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Create New Ticket</h2>
          <form onSubmit={handleCreateTicket}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Ticket</button>
          </form>
        </div>
      )}

      <h2 style={{ marginBottom: '1rem' }}>Tickets</h2>
      {tickets.length === 0 ? (
        <div className="card">
          <p>No tickets found. Create your first ticket!</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3>{ticket.title}</h3>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>Category: {ticket.category}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    backgroundColor: getStatusColor(ticket.status),
                    color: 'white',
                  }}
                >
                  {ticket.status}
                </span>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    backgroundColor: getPriorityColor(ticket.priority),
                    color: 'white',
                  }}
                >
                  {ticket.priority}
                </span>
              </div>
            </div>
            <p style={{ marginBottom: '1rem' }}>{ticket.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#666' }}>
              <div>
                <p>Created by: {ticket.createdBy.name}</p>
                {ticket.assignedTo && <p>Assigned to: {ticket.assignedTo.name}</p>}
              </div>
              {(user?.role === 'agent' || user?.role === 'admin') && (
                <select
                  value={ticket.status}
                  onChange={(e) => handleUpdateStatus(ticket._id, e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

