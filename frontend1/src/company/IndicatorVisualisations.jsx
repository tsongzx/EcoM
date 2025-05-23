import React, { useEffect, useState } from 'react';
import { getIndicatorsInfoByName } from '../helper';
import VisualisationsTab from '../visualisations/VisualisationsTab';
import { Box } from '@mui/material';

const IndicatorVisualisations = ({ companyIndicators, companyName }) => {
  // indicator visualisations
  const [graphValues, setGraphValues] = useState({});

  const [selectedYears, setSelectedYears] = useState([]);
  const [indicatorInfo, setIndicatorInfo] = useState({});

  useEffect(() => {
    const getIndicatorInfo = async () => {
      const info = await getIndicatorsInfoByName();
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
          continue;
        }

        if (!(indicator_name in graph_data)) {
          graph_data[indicator_name] = [];
        }

        graph_data[indicator_name].push({
          indicator: indicator_name,
          year: year,
          [companyName]: indicator_data.indicator_value,
          // company: companyName,
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
    console.log(selectedYears);
  }, [companyIndicators, selectedYears]);

  const isDataReady = () => {
    return (
      graphValues &&
      indicatorInfo &&
      Object.keys(graphValues).length > 0 &&
      Object.keys(indicatorInfo).length > 0
    );
  };
  return (
    <>
      {isDataReady() ?
        (<VisualisationsTab info={indicatorInfo} graphValues={graphValues} categories={[companyName]} filterColumn={'pillar'} metricInfoCard={false}></VisualisationsTab>) : (<Box>...loading</Box>)}
    </>
  );
}

export default IndicatorVisualisations;