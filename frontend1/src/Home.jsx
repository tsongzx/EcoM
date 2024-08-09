import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '@mui/material';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import ESGInfo from './ESGInfo';
import FancyButton from './assets/FancyButton';

const Home = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollRef = useRef(null);

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
        Cookies.set('authToken', token);
        handleCloseLogin();
        
        // handleCloseLogin();
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

  const handleScroll = () => scrollRef.current.scrollIntoView({ behavior: 'smooth' });

  return (
    <div id='Home'>
      <Card id={navbar ? 'renderedNavbar' : 'unrenderedNavbar'} style={{backgroundColor: '#B4B2FC', paddingRight: '30px', marginTop: '3px', marginBottom: '3px'}}>
        <Card style={{ border: 'none', width: '100%', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#B4B2FC'}}>
          <Button className="loginButton" type="submit" variant="contained" onClick={openLoginModal} style={{marginRight: '3px'}}>Login</Button>
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
      <div id='homeTitleContainer'>
        <div id='header'>
          EcoM
        </div>
        <div id='titleContainer'>
          <h1 id='homeTitle'>EcoM</h1>
          <p id='homeDesc'>ESG Analysis Platform</p>
          <div style={{ display: 'flex', maxWidth: '400px', minWidth: '250px', justifyContent: 'space-between' }}>
            <Button className="titleButton loginButton" type="submit" variant="contained" onClick={openLoginModal}>Login</Button>
            <Button className="titleButton registerButton" type="submit" variant="contained" onClick={openRegisterModal}>Register</Button>
          </div>
          <FancyButton text={"learn more"} handleClick={handleScroll} id='fancy-home-button'/>
        </div>
      </div>
      <div id='homeAbout' ref={scrollRef}>
        {/* <div className='aboutContainer'>
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

        </div> */}

        <ESGInfo />

      </div>
    </div>
  );
};

export default Home;
