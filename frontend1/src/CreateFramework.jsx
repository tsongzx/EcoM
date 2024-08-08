import React, { useState, useEffect } from 'react';
import { Card, Button, Container } from '@mui/material';
import CreateFrameworkBody from './company/CreateFramework';
import Navbar from './navbar/Navbar.jsx';
import './dashboard/Dashboard.css'

const CreateFramework = () => {
  return (
    <>
      <Navbar></Navbar>
      <Container
        sx={{
          height: 'calc(100vh - 50px)',
          width: '100%'
        }}>
        <CreateFrameworkBody></CreateFrameworkBody>
      </Container>
    </>
  );
}

export default CreateFramework;