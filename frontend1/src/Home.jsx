import React, { useState, useEffect } from 'react';
import { Card, Button } from '@mui/material';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import imageCat from './assets/IMG_2678.jpg';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const Home = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  };

  const handleCloseLogin = () => {
    setLoginModalOpen(false);
  };

  const handleCloseRegister = () => {
    setRegisterModalOpen(false);
  };

  const handleLogin = (email, password) => {
    asyncLogin(email, password);
  };

  const asyncLogin = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      
      const response = await axios.post('http://127.0.0.1:8000/auth/login', formData);

      if (response.status === 200) {
        console.log('User logged in successfully:', response.data);
        const token = response.data.access_token;
        Cookies.set('authToken', token); // Session cookie
        handleCloseLogin();
        navigate('./Dashboard');
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setErrorMessage('Incorrect email or password.');
      } else {
        setErrorMessage('Login error: ' + error);
      }
    }
  };

  const handleRegister = (name, email, password) => {
    asyncRegister(name, email, password);
  };

  const asyncRegister = async (name, email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/register', {
        email,
        full_name: name,
        password
      });

      if (response.status === 200) {
        console.log('User registered successfully:', response.data);
        const token = response.data.access_token;
        Cookies.set('authToken', token);

        handleCloseRegister();
        navigate('./Dashboard');
      } else {
        setErrorMessage('Registration failed: ' + response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('Email already registered.');
      } else {
        setErrorMessage('Registration error: ' + error.message);
      }
    }
  };

  const registerFromLogin = () => {
    handleCloseLogin();
    setRegisterModalOpen(true);
  };

  const loginFromRegister = () => {
    handleCloseRegister();
    setLoginModalOpen(true);
  };

  useEffect(() => {
    const showNavBar = () => {
      if (window.scrollY >= window.innerHeight - 300) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }
    };
    window.addEventListener('scroll', showNavBar);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', showNavBar);
    };
  }, []);

  return (
    <div id='Home'>
      <Card id={navbar ? 'renderedNavbar' : 'unrenderedNavbar'}>
        <Card style={{ border: '1px solid red', width: '50%' }} />
        <Card style={{ border: '1px solid black', width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button className="loginButton" type="submit" variant="contained" onClick={openLoginModal}>Login</Button>
          <Button className="registerButton" type="submit" variant="contained" onClick={openRegisterModal}>Register</Button>
        </Card>
        <LoginModal 
          open={loginModalOpen} 
          handleCloseLogin={handleCloseLogin} 
          handleLogin={handleLogin} 
          goToRegister={registerFromLogin} 
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />
        <RegisterModal
          open={registerModalOpen}
          handleCloseRegister={handleCloseRegister}
          handleRegister={handleRegister}
          goToLogin={loginFromRegister}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />
      </Card>
      <div id='homeTitleContainer' style={{ height: '100vh', background: 'linear-gradient(to right, #3373b0, #e7f1fb)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <h1 id='homeTitle'>CRUMPET</h1>
          <p>ESG Analysis Platform</p>
          <div style={{ display: 'flex', maxWidth: '400px', minWidth: '250px', justifyContent: 'space-between' }}>
            <Button className="titleButton loginButton" type="submit" variant="contained" onClick={openLoginModal}>Login</Button>
            <Button className="titleButton registerButton" type="submit" variant="contained" onClick={openRegisterModal}>Register</Button>
          </div>
        </div>
        <button id="learnMore" onClick={() => {
          window.scrollBy({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}>
          <svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330">
            <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
              c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
              s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"/>
          </svg>
          learn more
        </button>
      </div>
      <div id='homeAbout'>
        <div className='aboutContainer'>
          <img src={imageCat} alt='placeholderImage' />
          <div className='aboutTextContainer'>
            <h2>AI Integration</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>

        <div className='aboutContainer'>
          <div className='aboutTextContainer'>
            <h2>Comparison mode</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <img src={imageCat} alt='placeholderImage' />
        </div>

        <div className='aboutContainer'>
          <img src={imageCat} alt='placeholderImage' />
          <div className='aboutTextContainer'>
            <h2>Customised Homescreen</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>

        <div className='aboutContainer'>
          <div className='aboutTextContainer'>
            <h2>Comparison mode</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <img src={imageCat} alt='placeholderImage' />

        </div>

      </div>
    </div>
  );
};

export default Home;
