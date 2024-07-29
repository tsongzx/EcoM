import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
} from '@mui/material';
import SelectFramework from './SelectFramework';
import MetricIndicatorsCard from './MetricIndicatorsCard';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const drawerWidth = 240;

const LeftPanel = ({
  setSelectedFramework,
  officialFrameworks,
  selectedIndicators, selectedMetrics, metricNames, setSelectedIndicators, setSelectedMetrics,
  allIndicators, allIndicatorsInfo, setMetricNames, setAllIndicators,
  sliderValues, sliderValuesFixed, sliderValuesIndicatorFixed, metricNamesFixed,
  selectedMetricsFixed, allIndicatorsFixed, selectedIndicatorsFixed, sliderValuesIndicator,
  setSliderValuesIndicator, setSliderValues, selectedFramework, setCompareModalOpen
}) => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/dashboard');
  };

  const openCompareModal = () => {
    setCompareModalOpen(true);
  };

  return (
    <Box
      sx={{
        width: '30vw',
        backgroundColor: 'white',
        overflow: "hidden",
        overflowY: "scroll",
      }}>
        <Button sx={{width: '100%'}}
          variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={handleReturn}>
          Return to Dashboard
        </Button>
        <Button variant="contained" 
          sx={{width: '100%', margin: '1vh 0'}} 
          onClick={openCompareModal}>Compare</Button>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          paddingTop: '1vh'
        }}>
          <SelectFramework
            setSelectedFramework={setSelectedFramework}
            setMetricNames={setMetricNames}
            setSelectedMetrics={setSelectedMetrics}
            setAllIndicators={setAllIndicators}
            setSelectedIndicators={setSelectedIndicators}
            selectedFramework={selectedFramework}
            officialFrameworks={officialFrameworks}
            />
          <MetricIndicatorsCard
            selectedIndicators={selectedIndicators}
            selectedMetrics={selectedMetrics}
            metricNames={metricNames}
            setSelectedIndicators={setSelectedIndicators}
            setSelectedMetrics={setSelectedMetrics}
            allIndicators={allIndicators}
            allIndicatorsInfo={allIndicatorsInfo}
            setMetricNames={setMetricNames}
            setAllIndicators={setAllIndicators}
            sliderValues={sliderValues}
            sliderValuesFixed={sliderValuesFixed}
            sliderValuesIndicatorFixed={sliderValuesIndicatorFixed}
            metricNamesFixed={metricNamesFixed}
            selectedMetricsFixed={selectedMetricsFixed}
            allIndicatorsFixed={allIndicatorsFixed}
            selectedIndicatorsFixed={selectedIndicatorsFixed}
            sliderValuesIndicator={sliderValuesIndicator}
            setSliderValuesIndicator={setSliderValuesIndicator}
            setSliderValues={setSliderValues}
          />
        </div>
    </Box>
    // <Drawer
    //   sx={{
        
    //     width: drawerWidth,
    //     flexShrink: 0,
    //     '& .MuiDrawer-paper': {
    //       width: drawerWidth,
    //       boxSizing: 'border-box',
    //     },
    //   }}
    //   variant="permanent"
    //   anchor="left"
    // >
    //   {/* <Toolbar />
    //   <Divider /> */}
    //   <List>
    //     {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
    //       <ListItem key={text} disablePadding>
    //         <ListItemButton>
    //           <ListItemIcon>
    //             {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
    //           </ListItemIcon>
    //           <ListItemText primary={text} />
    //         </ListItemButton>
    //       </ListItem>
    //     ))}
    //   </List>
    //   <Divider />
    //   <List>
    //     {['All mail', 'Trash', 'Spam'].map((text, index) => (
    //       <ListItem key={text} disablePadding>
    //         <ListItemButton>
    //           <ListItemIcon>
    //             {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
    //           </ListItemIcon>
    //           <ListItemText primary={text} />
    //         </ListItemButton>
    //       </ListItem>
    //     ))}
    //   </List>
    // </Drawer> 
  );
}

export default LeftPanel;