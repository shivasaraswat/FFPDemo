import React, { useState } from 'react';
import './Common.css';
import api from '../services/api';
import { useNotifications } from '../context/NotificationContext';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { unreadCount } = useNotifications();

  const sendTestNotification = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await api.post('/notifications/test');
      setMessage({
        type: 'success',
        text: '✅ Test notification sent! Check the notification bell (top right).'
      });
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Failed to send notification: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const sendCustomNotification = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await api.post('/notifications/me', {
        type: 'success',
        title: 'Custom Test Notification',
        message: 'This is a custom notification sent from Dashboard!',
        data: { source: 'dashboard', timestamp: new Date().toISOString() }
      });
      
      setMessage({
        type: 'success',
        text: '✅ Custom notification sent! Check the notification bell.'
      });
      
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Failed to send notification: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="breadcrumb">Dashboard</p>
      </div>
      <div className="page-content">
        <div className="card">
          <h2>Dashboard Overview</h2>
          <p>This page will display dashboard statistics and overview.</p>
          
          {/* Notification Testing Section */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>🔔 Notification Testing</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              Test real-time notifications using Event Hub + WebSocket
            </p>
            
            {message && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '4px',
                backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                color: message.type === 'success' ? '#155724' : '#721c24',
                border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {message.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={sendTestNotification}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Sending...' : '📬 Send Test Notification'}
              </button>

              <button
                onClick={sendCustomNotification}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Sending...' : '✨ Send Custom Notification'}
              </button>
            </div>

            {unreadCount > 0 && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.5rem', 
                backgroundColor: '#fff3cd',
                borderRadius: '4px',
                color: '#856404'
              }}>
                📬 You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}. 
                Check the notification bell in the top right corner!
              </div>
            )}

            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: '#e7f3ff',
              borderRadius: '4px',
              fontSize: '0.875rem',
              color: '#004085'
            }}>
              <strong>💡 Tip:</strong> After clicking the button, check the notification bell (🔔) 
              in the top right corner. The notification should appear in real-time!
            </div>
          </div>

          <div className="placeholder-content" style={{ marginTop: '2rem' }}>
            <p>Other dashboard content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


