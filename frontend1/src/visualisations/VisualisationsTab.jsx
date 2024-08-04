import React, { useEffect, useState } from 'react';
import VisualisationsPanel from './VisualisationsPanel';
import { Tabs, Tab, Box } from '@mui/material';

const VisualisationsTab = ({ graphValues, info, categories, filterColumn, displayInfoCard }) => {
  const [filter, setFilter] = useState("E");

  console.log(graphValues);

  const handleChange = (event, newValue) => {
    setFilter(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Tabs
        value={filter}
        onChange={handleChange}
        aria-label="Visualisation Filters"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Environmental" value="E" />
        <Tab label="Social" value="S" />
        <Tab label="Governance" value="G" />
        <Tab label="All" value="All" />
      </Tabs>
      {/* Rendering content based on the selected tab */}
        <VisualisationsPanel
          graphValues={graphValues}
          info={info}
          filter={filter}
          categories={categories}
          filterColumn={filterColumn}
          displayInfoCard={displayInfoCard}
        />
      </Box>
  );
}

export default VisualisationsTab;