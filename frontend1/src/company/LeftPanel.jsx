import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
} from '@mui/material';
import SelectFramework from './SelectFramework';
import MetricIndicatorsCard from './MetricIndicatorsCard';
import AdditionalMetrics from "./AdditionalMetrics";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getIndicatorFromMetric } from "../helper";

const LeftPanel = ({
  setSelectedFramework,
  officialFrameworks,
  selectedIndicators, selectedMetrics, metricNames, setSelectedIndicators, setSelectedMetrics,
  allIndicators, allIndicatorsInfo, setMetricNames, setAllIndicators,
  sliderValues, sliderValuesFixed, sliderValuesIndicatorFixed, metricNamesFixed,
  selectedMetricsFixed, allIndicatorsFixed, selectedIndicatorsFixed, sliderValuesIndicator,
  setSliderValuesIndicator, setSliderValues, selectedFramework, setCompareModalOpen, allMetrics, 
  setSliderValuesFixed, setSliderValuesIndicatorFixed, setFrameworkDisplay, setMetricNamesFixed,
  setSelectedMetricsFixed, setAllIndicatorsFixed, setSelectedIndicatorsFixed
}) => {
  const navigate = useNavigate();

  const [exitFramework, setExitFramework] = useState(false);

  const handleReturn = () => {
    navigate('/dashboard');
  };

  const openCompareModal = () => {
    setCompareModalOpen(true);
  };

  useEffect(() => {
    console.log(metricNamesFixed);
  }, [metricNamesFixed]);

  useEffect(() => {
    console.log('Selected Metrics:', selectedMetrics);
  }, [selectedMetrics]);

  const updateMetricName = async (newValue, newValue1, unselectedMetricId) => {
    console.log(unselectedMetricId);
    console.log('Updating metric names:', newValue, newValue1);
    setMetricNames(newValue);
    setSelectedMetrics(newValue1);
    console.log('Metric names set:', newValue);
    console.log('Selected metrics set:', newValue1);
    const unselectedIndicators = await getIndicatorFromMetric(unselectedMetricId);
    console.log(unselectedIndicators);
    console.log(allIndicators);
    setAllIndicators((prevIndicators) => ({
      ...prevIndicators,
      [unselectedMetricId]: unselectedIndicators
    }));
    const indicatorIds = unselectedIndicators.map(indicator => indicator.indicator_id);
    console.log(indicatorIds);

    setSelectedIndicators((prevIndicators) => ({
      ...prevIndicators,
      [unselectedMetricId]: indicatorIds
    }));
   
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
        <Button variant="contained" 
          sx={{width: '100%', margin: '1vh 0'}} 
          onClick={() => setExitFramework(!exitFramework)}>Exit Framework View</Button>
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
          <AdditionalMetrics
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
            allMetrics={allMetrics}
            selectedFramework={selectedFramework}
            setSelectedFramework={setSelectedFramework}
            updateMetricName={updateMetricName}
            exitFramework={exitFramework}
            setExitFramework={setExitFramework}
          />
        </div>
    </Box> 
  );
}

export default LeftPanel;