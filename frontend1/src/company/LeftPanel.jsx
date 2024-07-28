import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SelectFramework from './SelectFramework';
import MetricIndicatorsCard from './MetricIndicatorsCard';
const drawerWidth = 240;

const LeftPanel = ({
  setSelectedFramework,
  officialFrameworks,
  selectedIndicators, selectedMetrics, metricNames, setSelectedIndicators, setSelectedMetrics,
  allIndicators, allIndicatorsInfo, setMetricNames, setAllIndicators,
  sliderValues, sliderValuesFixed, sliderValuesIndicatorFixed, metricNamesFixed,
  selectedMetricsFixed, allIndicatorsFixed, selectedIndicatorsFixed, sliderValuesIndicator,
  setSliderValuesIndicator, setSliderValues, selectedFramework
}) => {
  return (
    <Box
      sx={{
        width: '30vw',
        backgroundColor: 'white',
        overflow: "hidden",
        overflowY: "scroll",
      }}>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
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