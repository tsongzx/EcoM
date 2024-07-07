import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Cookies from 'js-cookie';

const Navbar = () => {
    const navigate = useNavigate();

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
        </div>
    );
}

export default Navbar;