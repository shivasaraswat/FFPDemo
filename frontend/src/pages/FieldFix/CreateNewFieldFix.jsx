import React, { useState, useEffect } from 'react';
import { fieldFixService } from '../../services/fieldFixService';
import './FieldFix.css';

const CreateNewFieldFix = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fieldFixService.getDemo();
      setData(response);
    } catch (err) {
      console.error('Failed to load field fix demo:', err);
      setError(err.response?.data?.error || 'Failed to load field fix demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Field Fix</h1>
        <p className="breadcrumb">Field Fix / Create New Field Fix</p>
      </div>
      <div className="page-content">
        <div className="card">
          <h2>Create New Field Fix</h2>
          
          {loading && (
            <div className="loading-message">
              <p>Loading field fix demo...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
            </div>
          )}

          {data && !loading && (
            <div className="demo-content">
              <h3>API Response:</h3>
              <div className="demo-data">
                <p><strong>Message:</strong> {data.message}</p>
                {data.data && (
                  <div className="demo-details">
                    <p><strong>ID:</strong> {data.data.id}</p>
                    <p><strong>Title:</strong> {data.data.title}</p>
                    <p><strong>Description:</strong> {data.data.description}</p>
                    <p><strong>Status:</strong> {data.data.status}</p>
                    <p><strong>Created At:</strong> {new Date(data.data.createdAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!data && !loading && !error && (
            <div className="placeholder-content">
              <p>Content coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateNewFieldFix;

