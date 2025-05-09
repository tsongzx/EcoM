import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import Cookies from 'js-cookie';
import Profile from '../Profile';
import { AppBar, Stack, Toolbar } from '@mui/material';

const Navbar = () => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    // Go back to the first page
    const handleLogout = () => {
        Cookies.remove('authToken');
        navigate('/');
    };

    // Go back to the dashboard
    const handleHome = (event) => {
        event.preventDefault();
        navigate('/dashboard');
    }

    const handleCompare = (event) => {
      event.preventDefault();
      navigate('/compare', { state: { companiesList: [], selectedFramework: null } });
    }

    const handleAbout = (event) => {
      event.preventDefault();
      navigate('/about');
    }

    return (
    <>
      <AppBar position="fixed"
        sx={{
          backgroundColor: '#B4B2FC',
          height: '50px',
          position: 'fixed',
          width: '100%',
          padding: '0 24px'
      }}>
        <Toolbar
          sx={{
            minHeight: {
              xs: '50px', // Default for small screens
              sm: '50px'  // Override for screens 600px and above
            }
          }}>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Stack direction="row" spacing={3}>
              <li className='navbar-button' id='home'><a href="/dashboard" onClick={handleHome}>Home</a></li>
              <li className='navbar-button' id='compare'><a href="/compare" onClick={handleCompare}>Compare Companies</a></li>
              <li className='navbar-button' id='about'> <a href="/about" onClick={handleAbout}>About</a></li>
            </Stack>
            <Stack direction="row" spacing={3}>
              <li className='navbar-button' id='logout'><a href="/" onClick={handleLogout}>Logout</a></li>
              <li className='navbar-button' id='profile'><a onClick={() => {setIsProfileOpen(!isProfileOpen)}}>Profile</a></li>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      {isProfileOpen && (<div className='profileTab'>
        <button className="closepfp-button" onClick={() => {setIsProfileOpen(false)}}>close</button>
        <Profile/>
      </div>)}
      <div className='nav-placeholder'></div>
    </>
  );
}

export default Navbar;