'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Helpdesk Platform</h1>
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Welcome, {user.name} ({user.role})</span>
            <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login" className="btn btn-primary">Login</Link>
            <Link href="/register" className="btn btn-secondary">Register</Link>
          </div>
        )}
      </header>

      <main>
        <div className="card">
          <h2>Welcome to Helpdesk Platform</h2>
          <p style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            A cloud-ready ticketing and helpdesk platform for companies.
            Manage support tickets efficiently with role-based access control.
          </p>
          {!user && (
            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/register" className="btn btn-primary">Get Started</Link>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          <div className="card">
            <h3>Submit Tickets</h3>
            <p>Create and track support tickets for your issues.</p>
          </div>
          <div className="card">
            <h3>Manage Tickets</h3>
            <p>View, update, and resolve tickets efficiently.</p>
          </div>
          <div className="card">
            <h3>Role-Based Access</h3>
            <p>Different permissions for users, agents, and admins.</p>
          </div>
        </div>
      </main>
    </div>
  );
}


