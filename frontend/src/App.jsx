import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Nexus from './components/Nexus';
import Intake from './components/Intake';
import Services from './components/Services';
import Invoices from './components/Invoices';

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo">Vault</div>
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/nexus" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Nexus</NavLink>
          <NavLink to="/intake" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Intake</NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Services</NavLink>
          <NavLink to="/invoices" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Invoices</NavLink>
        </aside>
        
        <main className="main-content">
          <header className="header">
             <h2>Sales Management System</h2>
             <div className="user-profile">Anurag Yadav</div>
          </header>
          
          <div className="content-body">
             <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/nexus" element={<Nexus />} />
                <Route path="/intake" element={<Intake />} />
                <Route path="/services" element={<Services />} />
                <Route path="/invoices" element={<Invoices />} />
             </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
