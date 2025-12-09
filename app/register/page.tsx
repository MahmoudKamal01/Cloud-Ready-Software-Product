'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '2rem',
            }}
          >
            🎫
          </div>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
            }}
          >
            Create Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Get started with your ticket management
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                <span style={{ fontSize: '1.125rem' }}>⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
              />
              <small
                style={{
                  color: '#64748b',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                  display: 'block',
                }}
              >
                Must be at least 6 characters
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            >
              {loading ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }}
                  ></span>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
              fontSize: '0.875rem',
            }}
          >
            <span style={{ color: '#64748b' }}>Already have an account? </span>
            <Link href="/login" style={{ fontWeight: '500' }}>
              Sign in instead
            </Link>
          </div>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: '#94a3b8',
            fontSize: '0.813rem',
          }}
        >
          By registering, you agree to our terms and conditions
        </p>
      </div>

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
