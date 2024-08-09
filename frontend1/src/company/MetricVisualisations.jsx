import React, { useEffect, useState } from 'react';
import { getMetricBarGraph, getAllMetricsAvailable } from '../helper';
import VisualisationsTab from '../visualisations/VisualisationsTab';
import { Box, Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import CircularLoader from '../utils/CircularLoader.jsx';

const MetricVisualisations = ({ selectedFramework, selectedMetrics, graphStateChange, companyName, companyIndicators }) => {

  console.log(selectedFramework);
  const [graphValues, setGraphValues] = useState({});
  const [metricInfo, setMetricInfo] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getMetricData = async () => {
      const metricsByCategory = await getAllMetricsAvailable();
      const allMetrics = [...metricsByCategory['E'], ...metricsByCategory['S'], ...metricsByCategory['G']]

      const metricDict = allMetrics.reduce((acc, metric) => {
        acc[metric.id] = metric;
        return acc;
      }, {});
      setMetricInfo(metricDict);
    }
    getMetricData();
  }, []);

  useEffect(() => {
    const getGraphValues = async () => {
      setLoading(true);
      const values = await getMetricBarGraph(selectedFramework, [companyName]);
      setGraphValues(values);
      console.log(values);
      setLoading(false);
    }
    getGraphValues();
  }, [companyName, selectedFramework]);

  // useEffect(() => {
  //   setLoading(true);
  //   const fetchMetricScores = async() => {
  //     let metricScores = {};
  //     for (let idMetric of selectedMetrics) {
  //       const metricList = []
  //       const indicatorsInfo = await getIndicatorsForMetric(selectedFramework, idMetric);
  //       console.log(`${idMetric} - ${indicatorsInfo}`);

  //       const weightings = indicatorsInfo.reduce((acc, indicator) => {
  //         acc[indicator.indicator_name] = indicator.weighting;
  //         return acc;
  //       }, {});

  //       const years = Object.keys(companyIndicators);
  //       console.log(years);
  //       for (const year of years) {
  //         const score = await getMetricScoreByYear(companyIndicators[year], weightings);
  //         console.log(score);
  //         metricList.push({
  //           year: year,
  //           [companyName]: score
  //         })
  //       }

  //       metricScores[idMetric] = metricList;
  //     }
  //     console.log(metricScores);
  //     setGraphValues(metricScores);
  //   }
  //   fetchMetricScores();
  //   setLoading(false);
  // }, [graphStateChange, companyName, companyIndicators]);

  const isDataReady = () => {
    // Ensure both graphValues and indicatorInfo are objects and have data
    return (
      graphValues &&
      metricInfo &&
      Object.keys(graphValues).length > 0 &&
      Object.keys(metricInfo).length > 0
    );
  };

  return (
    <Box>
      {(isDataReady() & !loading) ? (
        <VisualisationsTab
          graphValues={graphValues}
          info={metricInfo}
          categories={[companyName]}
          filterColumn={'category'}
          metricInfoCard={true}
        />
      ) : (
        <Stack spacing={1}>
          <Skeleton variant="rectangular" height="5vh" />
          <Skeleton variant="rectangular" height="25vh" />
          <Skeleton variant="rectangular" height="25vh" />
          <Skeleton variant="rectangular" height="25vh" />
        </Stack>
      )}
      {loading ? <CircularLoader /> : null}
    </Box>
  );
}

export default MetricVisualisations;