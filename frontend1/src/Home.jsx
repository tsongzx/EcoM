import React, { useEffect, useState } from 'react';
import { Card, Typography, Button } from '@mui/material';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Home = () => {

	const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);


	const openLoginModal = () => {
		setLoginModalOpen(true);
	}

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  }

	const handleCloseLogin = () => {
	  setLoginModalOpen(false);
	};

  const handleCloseRegister = () => {
    setRegisterModalOpen(false);
  }

	const handleLogin = () => {
		console.log('Logging in...');
		// Add your login logic here
		handleCloseLogin();
	};

  const handleRegister = () => {
    console.log('Signing up...');
    handleCloseRegister();
  }

  const registerFromLogin = () => {
    handleCloseLogin();
    setRegisterModalOpen(true);
  }

  const loginFromRegister = () => {
    handleCloseRegister();
    setLoginModalOpen(true);
  }

  // const handleRegister = () => {
  //   console.log('Signing up...');
  //   handleClose
  // }
	

	return (
		<Card style={{ display: 'flex', flexDirection: 'row', border: '1px solid blue' }}>
			<Card style={{ border: '1px solid red', width: '50%' }}/>
			<Card style={{ border: '1px solid black', width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
				<Button type="submit" variant="contained" style={{ border: '1px solid red', right: '0', fontSize: '10px' }} onClick={openLoginModal}>Login</Button>
				<Button type="submit" variant="contained" style={{ border: '1px solid red', right: '0', fontSize: '10px' }} onClick={openRegisterModal}>Register</Button>
			</Card>
			<LoginModal open={loginModalOpen} handleCloseLogin={handleCloseLogin} handleLogin={handleLogin} goToRegister={registerFromLogin}/>
      <RegisterModal open={registerModalOpen} handleCloseRegister={handleCloseRegister} handleRegister={handleRegister} goToLogin={loginFromRegister}/>
		</Card>
	);
};

export default Home;

