import React, { useEffect, useState } from 'react';
import VisualisationsPanel from './VisualisationsPanel';
import { Tabs, Tab, Box } from '@mui/material';

const VisualisationsTab = ({ graphValues, info, categories, filterColumn, metricInfoCard }) => {
  const [filter, setFilter] = useState("E");

  console.log('INSIDE REPORT VISUALISATION TAB ________---_-_-_--_---');
  console.log(graphValues);
  console.log(info);
  console.log(categories);

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
          metricInfoCard={metricInfoCard}
        />
      </Box>
  );
}

export default VisualisationsTab;