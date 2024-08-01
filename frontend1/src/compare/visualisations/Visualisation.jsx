import {React, useEffect, useState, useRef} from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  Stack,
  Box
} from '@mui/material';
import Select from 'react-select';
import Navbar from '../../Navbar.jsx';
import { getOfficialFrameworks, getMetricForFramework, getMetricName, calculateMetricScore, getIndicatorBarGraph, getIndicatorsInfoByName } from '../../helper.js';
import LeftPanel from './LeftPanel.jsx';
import VisualisationsTab from '../../visualisations/VisualisationsTab.jsx';

const Visualisation = ({companies, frameworks, setCompanies, setMessage, setShowMessage, handleDeleteFromTable, handleClickCompanyName}) => {
  // const [companyMap, setCompanyMap] = useState(companies.reduce((map, company) => {
  //   map[company.id] = company.companyName;
  //   return map;
  // }, {}));
  const [indicatorDict, setIndicatorDict] = useState({});
  const [graphValues, setGraphValues] = useState({});

  const [selectedYears, setSelectedYears] = useState([]);  
  const [indicatorInfo, setIndicatorInfo] = useState({});
    
  const [display, setDisplay] = useState('indicators');
  const [framework, setFramework] = useState('');

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
      const companyList = companies.map(company => company.companyName);
      const indicatorDict = await getIndicatorBarGraph(companyList);
      setIndicatorDict(indicatorDict);  
      console.log(indicatorDict);
    }
    fetchData();
  }, [companies, selectedYears]);
  
  useEffect(() => {
    let graph = {};
    Object.keys(indicatorDict).map((indicator) => {
      graph[indicator] = []
      Object.keys(indicatorDict[indicator]).map((year) => {
        graph[indicator] = [...graph[indicator], indicatorDict[indicator][year]];
      });
    })
    // console.log(graph);
    setGraphValues(graph);
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
      <Box sx={{
        height: 'calc(100vh - 5vh)',
        display: 'flex',
        position: 'relative',
      }}>
        <LeftPanel companies={companies} setCompanies={setCompanies} setMessage={setMessage}
          setShowMessage={setShowMessage} handleDeleteFromTable={handleDeleteFromTable}
          handleClickCompanyName={handleClickCompanyName} display={display} setDisplay={setDisplay} framework={framework}
          setFramework={setFramework} frameworks={frameworks}></LeftPanel>
        <Box component="main" sx={{ 
          // flexGrow: 1, 
          width: '70vw',
          padding: '2vh 1vw 0 1vw',
          overflow: "hidden",
          overflowY: "scroll",
        }}>
          { isDataReady() && display === 'indicators' ?
          (<VisualisationsTab indicatorInfo={indicatorInfo} graphValues={graphValues}
            categories={companies.map(company => company.companyName)}
          ></VisualisationsTab>) : (<Box>...loading</Box>)}
          {display === 'framework' && <p>...metric graphs...</p>}
        </Box>
      </Box>
    </Box>
  );
}

export default Visualisation;