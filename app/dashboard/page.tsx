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
  const [filterStatus, setFilterStatus] = useState('all');
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
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          category: '',
        });
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
      case 'open':
        return '#3b82f6';
      case 'in-progress':
        return '#f59e0b';
      case 'resolved':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const filteredTickets =
    filterStatus === 'all'
      ? tickets
      : tickets.filter((t) => t.status === filterStatus);

  const statusCounts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    'in-progress': tickets.filter((t) => t.status === 'in-progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e2e8f0',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          ></div>
          <p style={{ color: '#64748b' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{ paddingTop: '2rem', paddingBottom: '4rem' }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}
            >
              Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Manage and track your support tickets
            </p>
          </div>
          <div
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <div
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              <span style={{ fontWeight: '500' }}>{user?.name}</span>
              <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>
                • {user?.role}
              </span>
            </div>
            <Link href="/" className="btn btn-secondary">
              Home
            </Link>
          </div>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              background:
                filterStatus === status ? 'var(--primary)' : 'var(--card-bg)',
              color: filterStatus === status ? 'white' : 'inherit',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              border: `1px solid ${
                filterStatus === status ? 'var(--primary)' : 'var(--border)'
              }`,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow:
                filterStatus === status ? 'var(--shadow-lg)' : 'var(--shadow)',
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                textTransform: 'capitalize',
                marginBottom: '0.5rem',
                opacity: filterStatus === status ? 1 : 0.7,
              }}
            >
              {status.replace('-', ' ')}
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: '700' }}>
              {count}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>
            {showCreateForm ? '✕' : '+'}
          </span>
          {showCreateForm ? 'Cancel' : 'Create New Ticket'}
        </button>
      </div>

      {showCreateForm && (
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            background:
              'linear-gradient(to bottom right, var(--card-bg), var(--card-bg))',
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
            }}
          >
            Create New Ticket
          </h2>
          <form onSubmit={handleCreateTicket}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter ticket title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g., Bug, Feature Request"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
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
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Ticket
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
          {filterStatus === 'all'
            ? 'All Tickets'
            : `${filterStatus.replace('-', ' ')} Tickets`.replace(
                /\b\w/g,
                (c) => c.toUpperCase()
              )}
        </h2>
      </div>

      {filteredTickets.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <p
            style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
            }}
          >
            No tickets found
          </p>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {filterStatus === 'all'
              ? 'Create your first ticket to get started!'
              : `No ${filterStatus} tickets at the moment.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '1rem',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {ticket.title}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#64748b',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.125rem 0.5rem',
                        background: '#f1f5f9',
                        borderRadius: '0.25rem',
                        color: '#475569',
                      }}
                    >
                      {ticket.category}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getStatusColor(ticket.status),
                      color: 'white',
                    }}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getPriorityColor(ticket.priority),
                      color: 'white',
                    }}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>

              <p
                style={{
                  marginBottom: '1rem',
                  color: '#475569',
                  lineHeight: '1.6',
                }}
              >
                {ticket.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border)',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ fontSize: '0.813rem', color: '#64748b' }}>
                  <div>
                    Created by <strong>{ticket.createdBy.name}</strong>
                  </div>
                  {ticket.assignedTo && (
                    <div style={{ marginTop: '0.25rem' }}>
                      Assigned to <strong>{ticket.assignedTo.name}</strong>
                    </div>
                  )}
                </div>
                {(user?.role === 'agent' || user?.role === 'admin') && (
                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      handleUpdateStatus(ticket._id, e.target.value)
                    }
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1.5px solid var(--border)',
                      background: 'var(--card-bg)',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
