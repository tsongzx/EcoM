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
        <div className='nav'>
            <ul>
                {/* <li><Link to="/">Home</Link></li> */}
                <li><a href="/dashboard" onClick={handleHome}>Home</a></li>
                <li><a href="/" onClick={handleLogout}>Logout</a></li>
            </ul>
            <button onClick={() => {setIsProfileOpen(!isProfileOpen)}}>Profile</button>
            {isProfileOpen && (<Profile/>)}
        </div>
    );
}

export default Navbar;