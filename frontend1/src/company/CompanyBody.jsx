import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Stack,
  Box
} from '@mui/material';
import SimpleLineChart from '../SimpleLineChart.jsx';
import Recommendations from './Recommendations.jsx';
import { getPrediction } from '../helper.js';

const CompanyBody = ({companyId,
  setSelectedFramework,
  officialFrameworks,
  selectedIndicators, selectedMetrics, metricNames, setSelectedIndicators, setSelectedMetrics,
  allIndicators, allIndicatorsInfo, setMetricNames, setAllIndicators,
  sliderValues, sliderValuesFixed, sliderValuesIndicatorFixed, metricNamesFixed,
  selectedMetricsFixed, allIndicatorsFixed, selectedIndicatorsFixed, sliderValuesIndicator,
  setSliderValuesIndicator, setSliderValues, selectedFramework, setCompareModalOpen, allMetrics, 
  setSliderValuesFixed, setSliderValuesIndicatorFixed, setFrameworkDisplay, setMetricNamesFixed,
  setSelectedMetricsFixed, setAllIndicatorsFixed, setSelectedIndicatorsFixed, eScore, sScore, gScore,
  frameworkScore, setFrameworkScore, indicatorsCompany, selectedYear, setMetricScores, 
  seteScore, setsScore, setgScore, findCategoricalMetrics, companyName
}) => {

  const aiPredict = async () => {
    for (let key in selectedIndicators) {
      let array = selectedIndicators[key];
      for (const element of array) {
        let objOfInterest = Object.values(allIndicatorsInfo).find(obj => obj.id === element);
  
        if (objOfInterest) {
          let indicatorName = objOfInterest.name;
          let metricUnit = objOfInterest.unit;
          let score = await getPrediction(indicatorName, metricUnit, companyName);
          console.log(score);
        }

      }
    }
  }

  return (
    <Box>
      <Box>
        <Stack direction="row" justifyContent="space-between"
          sx={{backgroundColor: "white"}}
        >
          <SimpleLineChart />
          <Recommendations companyId={companyId}/>
        </Stack>
        <Stack direction="row">
          <Button onClick={aiPredict}>AI Predict</Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default CompanyBody;