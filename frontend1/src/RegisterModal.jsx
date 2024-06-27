import {React, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Link } from '@mui/material';

const RegisterModal = ({ open, handleCloseRegister, handleRegister, goToLogin }) => {

  // Current state variables for registering
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // User clicks register button
  const onRegister = () => {

    // Empty parameters
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      setErrorMessage('Please fill in all fields.');
      // Insufficient password length
    } else if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      // Passwords do not match
    } else if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
    } else {
      // Goes to homepage
      setErrorMessage('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      handleRegister(name, email, password, confirmPassword);
    }
    
  };

  // User chooses to login from the register homepage
  const navigateToLogin = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    goToLogin();
  };

  // User clicks the cancel button in the register modal
  const onCancel = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    handleCloseRegister();
  }

  return (
    <Dialog open={open} onClose={handleCloseRegister}>
      <DialogTitle style={{ textAlign: 'center' }}>Register</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField autoFocus margin="dense" label="Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)}/>
        <TextField margin="dense" label="Email Address" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)}/>
        <TextField margin="dense" label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)}/>
        <TextField margin="dense" label="Confirm Password" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        {errorMessage && (
          <Typography color="error" variant="body2" style={{ marginTop: '16px' }}>
            {errorMessage}
          </Typography>
        )}
        <Typography variant="body2" style={{ marginTop: '16px' }}>
          Already have an account?{' '}
          <Link sx={{ cursor: 'pointer' }} onClick={navigateToLogin}>
            Login here
          </Link>
        </Typography>
        <DialogActions style={{ justifyContent: 'space-between' }}>
            <Button onClick={onCancel} color="primary">Cancel</Button>
            <Button onClick={onRegister} color="primary">Register</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;