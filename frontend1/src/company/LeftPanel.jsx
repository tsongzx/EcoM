import React, { useState } from "react";
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
import CreateFramework from "./CreateFramework";
import './company_css/LeftPanel.css'

// This component includes the majority of the left bar of the company page.
// It contains 3 children components 
// 1. Section showing the selected framework (if any has been selected)
// 2. Section showing all the metrics and indicators selected
// 3. Section showing additional metrics the users can select
const LeftPanel = ({
  setSelectedFramework,
  officialFrameworks,
  selectedIndicators, selectedMetrics, metricNames, setSelectedIndicators, setSelectedMetrics,
  allIndicators, allIndicatorsInfo, setMetricNames, setAllIndicators,
  sliderValues, sliderValuesFixed, sliderValuesIndicatorFixed, metricNamesFixed,
  selectedMetricsFixed, allIndicatorsFixed, selectedIndicatorsFixed, sliderValuesIndicator,
  setSliderValuesIndicator, setSliderValues, selectedFramework, setCompareModalOpen, allMetrics, 
  eScore, sScore, gScore,
  frameworkScore, setFrameworkScore, indicatorsCompany, selectedYear, setMetricScores, 
  seteScore, setsScore, setgScore, findCategoricalMetrics
}) => {
  const navigate = useNavigate();

  const [exitFramework, setExitFramework] = useState(false);

  const handleReturn = () => {
    navigate('/dashboard');
  };

  // Opens the modal if the user wants to open compare between companies
  const openCompareModal = () => {
    setCompareModalOpen(true);
  };

  // Component that allows the user to select/unselect metrics -> Passed into
  // children component
  const updateMetricName = async (newValue, newValue1, unselectedMetricId) => {
    setMetricNames(newValue);
    setSelectedMetrics(newValue1);
    const unselectedIndicators = await getIndicatorFromMetric(unselectedMetricId);
    setAllIndicators((prevIndicators) => ({
      ...prevIndicators,
      [unselectedMetricId]: unselectedIndicators
    }));
    const indicatorIds = unselectedIndicators.map(indicator => indicator.indicator_id);
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
        <Button className="left-panel-button" sx={{width: '100%'}}
          variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={handleReturn}>
          Return to Dashboard
        </Button>
        <Button className="left-panel-button" variant="contained" 
          sx={{width: '100%', margin: '1vh 0'}} 
          onClick={openCompareModal}>Compare</Button>
        <Button className="left-panel-button" variant="contained" 
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
            eScore={eScore}
            sScore={sScore}
            gScore={gScore}
            frameworkScore={frameworkScore}
            setFrameworkScore={setFrameworkScore}
            indicatorsCompany={indicatorsCompany}
            selectedYear={selectedYear}
            setMetricScores={setMetricScores}
            seteScore={seteScore}
            setsScore={setsScore}
            setgScore={setgScore}
            findCategoricalMetrics={findCategoricalMetrics}
            officialFrameworks={officialFrameworks}
            selectedFramework={selectedFramework}
          />
          <AdditionalMetrics
            selectedMetrics={selectedMetrics}
            metricNames={metricNames}
            setSelectedIndicators={setSelectedIndicators}
            setSelectedMetrics={setSelectedMetrics}
            setMetricNames={setMetricNames}
            allMetrics={allMetrics}
            setSelectedFramework={setSelectedFramework}
            updateMetricName={updateMetricName}
            exitFramework={exitFramework}
            setExitFramework={setExitFramework}
          />
          <CreateFramework/>
        </div>
    </Box> 
  );
}

export default LeftPanel;