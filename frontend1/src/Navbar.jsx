import React from 'react';
import Link from 'react-router-dom';

const listItemStyle = {
    textDecoration: 'none',
    fontSize: '1em',
    fontFamily: 'Verdana',
    display: 'inline',
    marginRight: '10px',
    color: 'white',
    fontWeight: 'bold',
  };

const Navbar = () => {
    //display two different login items depending on whether the user has logged in.
    return (
        <ul style={{
            id: 'navbar',
            backgroundColor: 'lightcoral',
            listStyleType: 'none',
            margin: '0 0',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}>
              <li style={listItemStyle}><Link style={listItemStyle} to="/">Home</Link></li>
              <li style={listItemStyle}><Link style={listItemStyle} to="/logout">Logout</Link></li>
          </ul>
    );
}

export default Navbar;