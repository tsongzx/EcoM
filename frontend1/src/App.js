import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Home from './Home.jsx';
import { Navigate } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
