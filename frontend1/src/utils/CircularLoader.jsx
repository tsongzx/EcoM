import {React} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const CircularLoader = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute',
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
     }}>
      <CircularProgress />
    </Box>
  );
}

export default CircularLoader;