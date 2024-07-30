import React, { useEffect, useState } from 'react';
import { getAllIndicators } from '../helper';
import VisualisationsTab from './visualisations/VisualisationsTab';
import { Box } from '@mui/material';

const Visualisations = ({companyIndicators, companyName}) => {
  // indicator visualisations
  const [graphValues, setGraphValues] = useState({});

  const [selectedYears, setSelectedYears] = useState([]);  
  const [indicatorInfo, setIndicatorInfo] = useState({});
    
  useEffect(() => {
    const getIndicatorInfo = async() => {
      const info = await getAllIndicators();
      console.log(info);
      setIndicatorInfo(info);
    }
    getIndicatorInfo();
  }, []);

  // create graph for each indicator
  // group indicators with same unit together - plot together
  
  const get_graph_values = () => {
    const graph_data = {};
    for (const [year, data] of Object.entries(companyIndicators)) {  
      for (const [indicator_name, indicator_data] of Object.entries(data)) {
        // Check if within selected years
        if (!selectedYears.includes(indicator_data.indicator_year_int.toString())) {
          // console.log(`Skipping year ${indicator_data.indicator_year_int} as it is not in selectedYears`);
          continue;
        }
  
        if (!(indicator_name in graph_data)) {
          graph_data[indicator_name] = [];
        }
  
        graph_data[indicator_name].push({
          indicator: indicator_name,
          year: year,
          value: indicator_data.indicator_value,
          company: companyName,
        });
      }
    }
    console.log('graph_data:', graph_data);
    return graph_data;
  };

  useEffect(() => {
    setSelectedYears(Object.keys(companyIndicators));
  }, [companyIndicators]);
  useEffect(() => {
    console.log(Object.keys(companyIndicators));
    setGraphValues(get_graph_values(companyIndicators));
    // right now, use all years
    console.log(selectedYears);
  }, [companyIndicators, selectedYears]);
  
  const isDataReady = () => {
    // Ensure both graphValues and indicatorInfo are objects and have data
    return (
      graphValues &&
      indicatorInfo &&
      Object.keys(graphValues).length > 0 &&
      Object.keys(indicatorInfo).length > 0
    );
  };
  return (
    <>
      { isDataReady() ?
      (<VisualisationsTab indicatorInfo={indicatorInfo} graphValues={graphValues}></VisualisationsTab>) : (<Box>...loading</Box>)}
    </>
  );
}

export default Visualisations;