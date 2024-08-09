import {React, useEffect, useState} from 'react';
import {
  Stack,
  Box
} from '@mui/material';
import { getIndicatorBarGraph, getIndicatorsInfoByName } from '../../helper.js';
import VisualisationsTab from '../../visualisations/VisualisationsTab.jsx';
import Skeleton from '@mui/material/Skeleton';
import CircularLoader from '../../utils/CircularLoader.jsx';

const IndicatorVisualisation = ({companies}) => {
  // const [companyMap, setCompanyMap] = useState(companies.reduce((map, company) => {
  //   map[company.id] = company.companyName;
  //   return map;
  // }, {}));
  const [indicatorDict, setIndicatorDict] = useState({});
  const [graphValues, setGraphValues] = useState({});

  const [selectedYears, setSelectedYears] = useState([]);  
  const [indicatorInfo, setIndicatorInfo] = useState({});
    
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getIndicatorInfo = async() => {
      const info = await getIndicatorsInfoByName();
      console.log(info);
      setIndicatorInfo(info);
    }
    getIndicatorInfo();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const indicatorDict = await getIndicatorBarGraph(companies);
      setIndicatorDict(indicatorDict);  
      console.log(indicatorDict);
    }
    fetchData();
  }, [companies, selectedYears]);
  
  useEffect(() => {
    setLoading(true);
    let graph = {};
    Object.keys(indicatorDict).map((indicator) => {
      graph[indicator] = []
      Object.keys(indicatorDict[indicator]).map((year) => {
        graph[indicator] = [...graph[indicator], indicatorDict[indicator][year]];
      });
    })
    // console.log(graph);
    setGraphValues(graph);
    setLoading(false);
  }, [indicatorDict])

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
    <Box>
      { isDataReady() ?
        (<VisualisationsTab info={indicatorInfo} graphValues={graphValues}
          categories={companies} filterColumn={'pillar'} metricInfoCard={false}
        ></VisualisationsTab>) : (
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

export default IndicatorVisualisation;