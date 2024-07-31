import React, { useEffect, useState } from 'react';
import VisualisationsPanel from './VisualisationsPanel';
import { Tabs, Tab, Box } from '@mui/material';

const VisualisationsTab = ({ graphValues, indicatorInfo, categories }) => {
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
      {filter === 'E' && <VisualisationsPanel graphValues={graphValues} indicatorInfo={indicatorInfo} filter={filter} categories={categories}/>}
      {filter === 'S' && <VisualisationsPanel graphValues={graphValues} indicatorInfo={indicatorInfo} filter={filter} categories={categories}/>}
      {filter === 'G' && <VisualisationsPanel graphValues={graphValues} indicatorInfo={indicatorInfo} filter={filter} categories={categories}/>}
      {filter === 'All' && <VisualisationsPanel graphValues={graphValues} indicatorInfo={indicatorInfo} filter={filter} categories={categories}/>}
    </Box>
  );
}

export default VisualisationsTab;