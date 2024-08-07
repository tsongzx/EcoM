import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../navbar/Navbar.jsx';
import './company_css/Company.css';
import ListModal from './ListModal.jsx';
import CompareModal from '../compare/CompareModal.jsx';
import {
  getOfficialFrameworks,
  getMetricForFramework,
  getMetricName,
  getIndicatorsForMetric,
  getIndicatorInfo,
  getFavouritesList,
  getAllIndicators,
  getAllMetricsAvailable,
  getMetricScoreByYear,
  getIndicatorFromMetric,
  companyScoreGeneral,
  fetchCompanyInfo

} from '../helper.js';
import axios from 'axios';
import Cookies from 'js-cookie';

import CreateFramework from './CreateFramework.jsx';
import LeftPanel from './LeftPanel.jsx';
import FrameworkTable from './FrameworkTable';
import CompanyHeader from './CompanyHeader.jsx';
import CompanyBody from './CompanyBody.jsx';
import GraphTableToggle from '../utils/GraphTableToggle.jsx';
import Visualisations from './Visualisations.jsx';

// This component renders the general company page once the user has chosen a company to view.
const Company = () => {
  const location = useLocation();
  const { companyId: initialCompanyId, companyName: initialCompanyName, initialFramework, selectedIndustry } = location.state || {};
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [reportModal, setOpenReportModal] = useState(false);
  const [isInFavs, setIsInFavs] = useState(false);
  const [officialFrameworks, setOfficialFrameworks] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(initialFramework);
  const [metricNames, setMetricNames] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [allMetrics, setAllMetrics] = useState({});
  const [allIndicators, setAllIndicators] = useState({});
  const [allIndicatorsInfo, setAllIndicatorsInfo] = useState({});
  const [selectedIndicators, setSelectedIndicators] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const token = Cookies.get('authToken');
  const [availableYears, setAvailableYears] = useState([]);
  const [indicatorsCompany, setIndicatorsCompany] = useState(null);
  const [sliderValues, setSliderValues] = useState({});
  const [sliderValuesIndicator, setSliderValuesIndicator] = useState({});
  const [sliderValuesFixed, setSliderValuesFixed] = useState(null);
  const [sliderValuesIndicatorFixed, setSliderValuesIndicatorFixed] = useState(null);
  const [metricNamesFixed, setMetricNamesFixed] = useState(null);
  const [selectedMetricsFixed, setSelectedMetricsFixed] = useState(null);
  const [allIndicatorsFixed, setAllIndicatorsFixed] = useState(null);
  const [selectedIndicatorsFixed, setSelectedIndicatorsFixed] = useState(null);
  const [metricScores, setMetricScores] = useState({});
  const [eScore, seteScore] = useState(null);
  const [sScore, setsScore] = useState(null);
  const [gScore, setgScore] = useState(null);
  const [frameworkScore, setFrameworkScore] = useState(null);
  const [graphStateChange, setGraphStateChange] = useState(false);
  const [ticker, setTicker] = useState(null);
  const [companyId, setCompanyId] = useState(initialCompanyId);
  const [frameworkDisplay, setFrameworkDisplay] = useState('tabular');

  // Use effects below set the state of the company name and company id based on
  // 1. Whether the user clicked into a company from the dashboard OR
  // 2. If the user decided to look up a company in the URL
  useEffect(() => {
    const asyncGetId = async () => {
      let url = window.location.href;
      let companyIdActual = url.split("/");
      if (companyIdActual) {
        setCompanyId(Number(companyIdActual[companyIdActual.length - 1]));
        const name = await fetchCompanyInfo(Number(companyIdActual[companyIdActual.length - 1]));
        setCompanyName(name.company_name);
        setTicker(name.ticker);
        console.log(name);
      }
    }
    asyncGetId();
  }, [window.location.href]);

  useEffect(() => {
    const fetchCompanyIndicators = async(companyName) => {
      const allMetricsAvailable = await getAllMetricsAvailable();
      setAllMetrics(allMetricsAvailable);
      const allIndicators1 = await getAllIndicators();
      setAllIndicatorsInfo(allIndicators1);
      const companyIndicators = await getIndicatorInfo(companyName);
      setIndicatorsCompany(companyIndicators);
      const years = Object.keys(companyIndicators);
      years.push('Predicted');
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[years.length - 2]); 
      }
    };

    const alternativeFetch = async () => {
      let url = window.location.href;
      let companyIdActual = url.split("/");
      setCompanyId(Number(companyIdActual[companyIdActual.length - 1]));
      const name = await fetchCompanyInfo(Number(companyIdActual[companyIdActual.length - 1]));
      setCompanyName(name.company_name);
      setTicker(name.ticker);

      const allMetricsAvailable = await getAllMetricsAvailable();
      setAllMetrics(allMetricsAvailable);
      const allIndicators1 = await getAllIndicators();
      setAllIndicatorsInfo(allIndicators1);
      const companyIndicators = await getIndicatorInfo(name.company_name);
      setIndicatorsCompany(companyIndicators);
      const years = Object.keys(companyIndicators);
      years.push('Predicted');
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[years.length - 2]); 
      }
    }

    if (companyId && companyName) {
      fetchCompanyIndicators(companyName);
    } else {
      alternativeFetch();
    }
    
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await addToRecentlyViewed(companyId);
      const availableOfficialFramework = await getOfficialFrameworks();
      setOfficialFrameworks(availableOfficialFramework);
    };


    // User is able to get the favorites list that they can add this company to
    const fetchLists = async () => {
      const favsList = await getFavouritesList();
      const listSearch = favsList.find(item => item.company_id === companyId);
      if (listSearch) {
        setIsInFavs(true);
      } else {
        setIsInFavs(false);
      }
    }
    if (companyId) {
      fetchData();
      fetchLists();
    }
  }, [companyId]);

  // Obtain the metrics and indicators associated with a certain framework, if the user 
  // has chosen to do so
  useEffect(() => {
    const fetchData = async () => {
      if (selectedFramework) {
        const metrics = await getMetricForFramework(selectedFramework);
        if (metrics) {
          const nameOfMetrics = [];
          const metricIds = [];
          for (const item of Object.values(metrics)) {
            const name = await getMetricName(item.metric_id);
            nameOfMetrics.push({ id: item.metric_id, name: name, category: item.category, weighting: item.weighting });
            metricIds.push(item.metric_id);
          }

          // Metric fixed is for if the user chooses to reset to default -> Avoids another API call
          setMetricNames(nameOfMetrics);
          setMetricNamesFixed(nameOfMetrics);
          setSelectedMetrics(metricIds);
          setSelectedMetricsFixed(metricIds);
          
          const newAllIndicators = {};
          for (let id of metricIds) {
            const indicators = await getIndicatorsForMetric(parseInt(selectedFramework), parseInt(id));
            newAllIndicators[id] = indicators;
          }

          setAllIndicators(newAllIndicators);
          setAllIndicatorsFixed(newAllIndicators);
          
          const newSelectedIndicators = {};
          for (const id of metricIds) {
            newSelectedIndicators[id] = newAllIndicators[id].map(indicator => indicator.indicator_id);
          }
          setSelectedIndicators(newSelectedIndicators);
          setSelectedIndicatorsFixed(newSelectedIndicators);

          // Find the weights of each metric as corresponding to the framework
          const initialSliderValues = {};
          for (let id of metricIds) {
            initialSliderValues[id] = metrics.find(item => item.metric_id === id).weighting;
          }
          setSliderValues(initialSliderValues);
          setSliderValuesFixed(initialSliderValues);

          const initialSliderValuesIndicator = {};

          Object.entries(newSelectedIndicators).forEach(([key, arr]) => {
            arr.forEach(entry => {
              const weighting = Object.values(newAllIndicators).flatMap(arr => arr).find(obj => obj.indicator_id === entry).weighting;
              // Indicator mapping is 'metricId-indicatorId' as some indicators can be shared across different metrics
              initialSliderValuesIndicator[`${key}-${entry}`] = weighting;
            });
          });
          setSliderValuesIndicator(initialSliderValuesIndicator);
          setSliderValuesIndicatorFixed(initialSliderValuesIndicator);
        }
      }
    };
    if (selectedFramework) {
      fetchData();
    }
  }, [selectedFramework]);

  useEffect(() => {
    setGraphStateChange(!graphStateChange);
    const runScore = async() => {
      let metricScoreMock = {};
      for (let idMetric of selectedMetrics) {
        const indicatorsInfo = await getIndicatorFromMetric(idMetric);

        const newObj = indicatorsInfo.reduce((acc, indicator) => {
          acc[indicator.indicator_name] = indicator.weighting;
          return acc;
        }, {});

        let correspondingScore;
        if (selectedYear !== 'Predicted') {
          // Gets the framework score for the user across a selected year
          correspondingScore = await getMetricScoreByYear(indicatorsCompany[selectedYear], newObj);
          if (isNaN(correspondingScore)) {
            correspondingScore = 0;
          }
        } else {
          correspondingScore = 0;
        }        
        
        let obj1 = {};
        obj1["score"] = correspondingScore;
        metricScoreMock[idMetric] = obj1;
      }

      setMetricScores(metricScoreMock);

      // Sets E, S and G scores
      const filteredEMetrics = findCategoricalMetrics(metricScoreMock, metricNames, 'E');
      seteScore(filteredEMetrics.reduce((sum, { score, weighting }) => sum + (score * weighting), 0));

      const filteredSMetrics = findCategoricalMetrics(metricScoreMock, metricNames, 'S');
      setsScore(filteredSMetrics.reduce((sum, { score, weighting }) => sum + (score * weighting), 0));

      const filteredGMetrics = findCategoricalMetrics(metricScoreMock, metricNames, 'G');
      setgScore(filteredGMetrics.reduce((sum, { score, weighting }) => sum + (score * weighting), 0));

    }

    if (selectedMetrics.length > 0 && selectedFramework && indicatorsCompany && selectedYear !== '' && Object.keys(allIndicators).length !== 0 && metricNames && metricNames.length > 0) {
      runScore();
    }
  }, [indicatorsCompany, selectedFramework, selectedMetrics, selectedYear, allIndicators, metricNames]);

  // This function finds the score of a category
  const findCategoricalMetrics = (metricScoreMock, metricNames, category) => {
    const eMetrics = metricNames.filter(metric => metric.category === category);
    let metricScoreMockReduced = Object.entries(metricScoreMock).reduce((acc, [key, value]) => {
      const metric = eMetrics.find(m => m.id === parseInt(key));
      if (metric) {
        acc[key] = {
          ...value,
          weighting: metric.weighting
        };
      }
      return acc;
    }, {});

    metricScoreMockReduced =  Object.values(metricScoreMockReduced);
    metricScoreMockReduced = metricScoreMockReduced.map(item => ({
      score: parseFloat(item.score),
      weighting: parseFloat(item.weighting)
    }));
    return metricScoreMockReduced;

  }

  // Once the user has viewed this company, it is added to recently viewed
  const addToRecentlyViewed = async (cId) => {
    if (!token) {
      console.error('No authToken cookie found');
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/recently_viewed?company_id=${cId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // User can choose to close a watchlist
  const handleCloseWatchList = () => {
    setWatchlistModalOpen(false);
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{
        height: 'calc(100vh - 5vh)',
        display: 'flex',
        position: 'relative',
      }}>
        {/* Everything observed on the left hand side of the screen */}
        <LeftPanel
            setSelectedFramework={setSelectedFramework}
            officialFrameworks={officialFrameworks}
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
            selectedFramework={selectedFramework}
            setCompareModalOpen={setCompareModalOpen}
            allMetrics={allMetrics}
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
        />
        <Box component="main" sx={{ 
          width: '70vw',
          padding: '2vh 1vw 0 1vw',
          overflow: "hidden",
          overflowY: "scroll",
        }}>
          <ListModal isOpen={watchlistModalOpen} handleClose={handleCloseWatchList} companyId={companyId} />
          {/* Top center half of the screen */}
          <CompanyHeader
            setWatchlistModalOpen={setWatchlistModalOpen}
            setOpenReportModal={setOpenReportModal}
            companyId={companyId}
            isInFavs={isInFavs} 
            setIsInFavs={setIsInFavs}
            companyName={companyName}
            selectedFramework={selectedFramework}
            selectedYear={selectedYear}
            indicatorsCompany={indicatorsCompany}
          />
          <CompanyBody 
            companyId={companyId}
          />
          <GraphTableToggle
            display={frameworkDisplay}
            setDisplay={setFrameworkDisplay}
          />
          {/* Visualises the table or the graph, depending on which one the user wants */}
          {frameworkDisplay === 'tabular' && <FrameworkTable
            indicatorsCompany={indicatorsCompany}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear} 
            companyName={companyName}
            availableYears={availableYears}
            selectedFramework={selectedFramework}
            selectedIndicators={selectedIndicators}
            metricNames={metricNames}
            allIndicators={allIndicators}
            metricScores={metricScores}
            allIndicatorsInfo={allIndicatorsInfo}
          />}
          {frameworkDisplay === 'graphical' && <Visualisations selectedMetrics={selectedMetrics} graphStateChange={graphStateChange} selectedFramework={selectedFramework} companyIndicators={indicatorsCompany} companyName={companyName}/>}
          <CompareModal companyId={companyId} companyName={companyName} isOpen={compareModalOpen} compareModalOpen={compareModalOpen} setCompareModalOpen={setCompareModalOpen} selectedFramework={selectedFramework}/>
        </Box>
      </Box>
    </Box>
  );
};

export default Company;
