import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Link } from '@mui/material';

const RegisterModal = ({ open, handleCloseRegister, handleRegister, goToLogin }) => {
  return (
    <Dialog open={open} onClose={handleCloseRegister}>
      <DialogTitle style={{ textAlign: 'center' }}>Register</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField autoFocus margin="dense" label="Name" type="text" fullWidth />
        <TextField margin="dense" label="Email Address" type="email" fullWidth />
        <TextField margin="dense" label="Password" type="password" fullWidth />
        <TextField margin="dense" label="Confirm Password" type="password" fullWidth />
        <Typography variant="body2" style={{ marginTop: '16px' }}>
          Already have an account?{' '}
          <Link sx={{ cursor: 'pointer' }} onClick={goToLogin}>
            Login here
          </Link>
        </Typography>
        <DialogActions style={{ justifyContent: 'space-between' }}>
            <Button onClick={handleCloseRegister} color="primary">Cancel</Button>
            <Button onClick={handleRegister} color="primary">Register</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
