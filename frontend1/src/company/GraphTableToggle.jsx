import React, { useEffect, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box } from '@mui/material';

const GraphTableToggle = ({frameworkDisplay, setFrameworkDisplay}) => {
  const handleChange = (event, newFrameworkDisplay) => {
    // console.log(event.target.innerText);
    console.log(newFrameworkDisplay);
    // setFrameworkDisplay(event.target.innerText);
    setFrameworkDisplay(newFrameworkDisplay);
    console.log(frameworkDisplay);
    
  };
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '1.5vh'
      }}
    >
      <ToggleButtonGroup
      color="primary"
      value={frameworkDisplay}
      exclusive
      onChange={handleChange}
      aria-label="Display"
    >
      <ToggleButton value="tabular">TABULAR</ToggleButton>
      <ToggleButton value="graphical">GRAPHICAL</ToggleButton>
    </ToggleButtonGroup>
    </Box>
  );
}
export default GraphTableToggle;