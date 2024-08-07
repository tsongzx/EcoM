import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import IndustryOverview from './IndustryOverview';
import IndustryPage from './IndustryPage';

const IndustryTab = ({selectedIndustry, setSelectedCompany}) => {
  const [tab, setTab] = useState("companies");

  const handleChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <Box sx={{ width: '100%', 
      typography: 'body1', 
      height: 'calc(70vh - 50px)',
      overflow: "hidden",
      overflowY: "scroll",
    }}>
      <Tabs
        value={tab}
        onChange={handleChange}
        aria-label="Industry Tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, 
          borderColor: 'divider', height: '3vh'}}
      >
        <Tab label="See companies" value="companies" />
        <Tab label="Overview" value="overview" />
      </Tabs>
      {/* Rendering content based on the selected tab */}
        {tab === 'companies' && <IndustryPage selectedIndustry={selectedIndustry} setSelectedCompany={setSelectedCompany}/>}
        {tab === 'overview' && <IndustryOverview selectedIndustry={selectedIndustry}></IndustryOverview>}
      </Box>
  );
}

export default IndustryTab;