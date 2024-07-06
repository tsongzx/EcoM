import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Dashboard from './Dashboard.jsx';
import Company from './company/Company.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company/:companyId" element={<Company />} />
          <Route path="/compare" element={<Compare/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
