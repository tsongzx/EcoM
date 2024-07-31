import React, { useEffect, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box } from '@mui/material';

const DisplayToggle = ({display, setDisplay, props}) => {
  const handleChange = (event, newDisplay) => {
    // console.log(event.target.innerText);
    console.log(newDisplay);
    setDisplay(newDisplay);
    console.log(newDisplay);
  };
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '1.5vh',
        ...props
      }}
    >
      <ToggleButtonGroup
      color="primary"
      value={display}
      exclusive
      onChange={handleChange}
      aria-label="Display"
    >
      <ToggleButton value="framework">Framework</ToggleButton>
      <ToggleButton value="indicators">Indicators</ToggleButton>
    </ToggleButtonGroup>
    </Box>
  );
}
export default DisplayToggle;