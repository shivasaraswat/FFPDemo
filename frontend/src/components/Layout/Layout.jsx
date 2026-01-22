import React from 'react';
import Sidebar from './Sidebar';
import RoleSwitcher from '../common/RoleSwitcher';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <RoleSwitcher />
        </header>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;


