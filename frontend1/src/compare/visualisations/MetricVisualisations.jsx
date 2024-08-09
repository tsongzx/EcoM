import {React, useEffect, useState} from 'react';
import {
  Stack,
  Box
} from '@mui/material';
import { getMetricBarGraph, getAllMetricsAvailable } from '../../helper.js';
import Skeleton from '@mui/material/Skeleton';
import CircularLoader from '../../utils/CircularLoader.jsx';
import VisualisationsTab from '../../visualisations/VisualisationsTab.jsx';

const MetricVisualisations = ({companies, framework}) => {
  
  const [graphValues, setGraphValues] = useState([]);
  const [metricInfo, setMetricInfo] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getMetricData = async() => {
      const metricsByCategory = await getAllMetricsAvailable();
      const allMetrics = [...metricsByCategory['E'], ...metricsByCategory['S'], ...metricsByCategory['G']]
      console.log(allMetrics);

      const metricDict = allMetrics.reduce((acc, metric) => {
        acc[metric.id] = metric;
        return acc;
      }, {});
      console.log(metricDict);

      setMetricInfo(metricDict);
    }
    getMetricData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const getGraphValues = async () => {
      const values = await getMetricBarGraph(framework.id, companies);
      setGraphValues(values);
    }
    getGraphValues();
    setLoading(false);
  }, [companies]);

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
      {isDataReady() ? (
        <VisualisationsTab
          graphValues={graphValues}
          info={metricInfo}
          categories={companies}
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
      {loading ? <CircularLoader/> : null}
    </Box>
  );

}

export default MetricVisualisations;