import React from 'react';
import { Box } from '@mui/material';
import MetricVisualisations from './MetricVisualisations.jsx'
import IndicatorVisualisations from './IndicatorVisualisations.jsx'

const Visualisations = ({companyIndicators, companyName, selectedFramework, graphStateChange, selectedMetrics}) => {
  return (
    <Box>
      {selectedFramework ? (<MetricVisualisations selectedFramework={selectedFramework} selectedMetrics={selectedMetrics} companyIndicators={companyIndicators} graphStateChange={graphStateChange} companyName={companyName}></MetricVisualisations>) : 
        (companyIndicators ? (<IndicatorVisualisations companyIndicators={companyIndicators} companyName={companyName}/>) : <p>...loading</p>)}  
    </Box>
     
  );
}

export default Visualisations;
