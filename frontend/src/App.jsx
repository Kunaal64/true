import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">Vault</div>
        <div className="nav-item active">Dashboard</div>
        <div className="nav-item">Nexus</div>
        <div className="nav-item">Intake</div>
        <div className="nav-item">Services</div>
        <div className="nav-item">Invoices</div>
      </aside>
      
      <main className="main-content">
        <header className="header">
           <h2>Sales Management System</h2>
           <div className="user-profile">Anurag Yadav</div>
        </header>
        
        <div className="content-body">
           <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default App;
