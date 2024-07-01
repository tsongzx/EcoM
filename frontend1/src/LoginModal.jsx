import {React, useState, useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Link } from '@mui/material';

const LoginModal = ({ open, handleCloseLogin, handleLogin, goToRegister, setErrorMessage, errorMessage }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setErrorMessage('');
  }, []);

  const onCancel = () => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
    handleCloseLogin();
  }

  const onLogin = () => {
    handleLogin(email, password);
    setErrorMessage('');
  }

  const navigateToRegister = () => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
    goToRegister();
  }

  const clickOutLogin = () => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
    handleCloseLogin();
  }

  return (
    <Dialog open={open} onClose={clickOutLogin}>
      <DialogTitle style={{ textAlign: 'center' }}>Login</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField autoFocus margin="dense" label="Email Address" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField margin="dense" label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && (
          <Typography color="error" variant="body2" style={{ marginTop: '16px' }}>
            {errorMessage}
          </Typography>
        )}
        <Typography variant="body2" style={{ marginTop: '16px', alignSelf: 'flex-start' }}>
          Don't have an account?{' '}
          <Link sx={{ cursor: 'pointer' }} onClick={navigateToRegister}>
            Register here
          </Link>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">Cancel</Button>
        <Button onClick={onLogin} color="primary">Login</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
