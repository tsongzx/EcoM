import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Cookies from 'js-cookie';
import Profile from './Profile';

const Navbar = () => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    // Go back to the first page
    const handleLogout = () => {
        Cookies.remove('authToken');
        navigate('/');
    };

    // Go back to the dashboard
    const handleHome = () => {
        navigate('/dashboard');
    }

    return (
        <div>
            <div className='nav-placeholder'></div>
            <div className='nav'>
                <ul>
                    {/* <li><Link to="/">Home</Link></li> */}
                    <li id='home'><a href="/dashboard" onClick={handleHome}>Home</a></li>
                    <li id='logout'><a href="/" onClick={handleLogout}>Logout</a></li>
                    <li id='profile'><a onClick={() => {setIsProfileOpen(!isProfileOpen)}}>Profile</a></li>
                </ul>
            </div>
            {isProfileOpen && (<div className='profileTab'>
                <button className="closepfp-button" onClick={() => {setIsProfileOpen(false)}}>close</button>
                <Profile/>
            </div>)}
        </div>
        
    );
}

export default Navbar;