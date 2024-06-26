import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    //display two different login items depending on whether the user has logged in.
    //GOING TO CONVERT THESE TO BUTTONS DOWN THE LINE
    return (
        <div className='nav'>
        <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/logout">Logout</Link></li>
          </ul>
        </div>
    );
}

export default Navbar;