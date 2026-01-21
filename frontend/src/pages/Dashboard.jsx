import React from 'react';
import './Common.css';

const Dashboard = () => {
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
          <div className="placeholder-content">
            <p>Content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


