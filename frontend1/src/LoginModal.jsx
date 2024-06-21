import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Link } from '@mui/material';

const LoginModal = ({ open, handleCloseLogin, handleLogin, goToRegister }) => {
  return (
    <Dialog open={open} onClose={handleCloseLogin}>
      <DialogTitle style={{ textAlign: 'center' }}>Login</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField autoFocus margin="dense" label="Email Address" type="email" fullWidth />
        <TextField margin="dense" label="Password" type="password" fullWidth />
        <Typography variant="body2" style={{ marginTop: '16px', alignSelf: 'flex-start' }}>
          Don't have an account?{' '}
          <Link sx={{ cursor: 'pointer' }} onClick={goToRegister}>
            Register here
          </Link>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseLogin} color="primary">Cancel</Button>
        <Button onClick={handleLogin} color="primary">Login</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
