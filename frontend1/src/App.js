import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Dashboard from './dashboard/Dashboard.jsx';
import Company from './company/Company.jsx';
import Compare from './compare/Compare.jsx';
import Profile from './Profile.jsx';
import Report from './reports/Report.jsx'
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company/:companyId" element={<Company />} />
          <Route path="/compare" element={<Compare/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/report/:companyId" element={<Report/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
