import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import Navbar from '../Navbar.jsx';
import './company_css/Company.css';
import WatchlistModal from './WatchlistModal.jsx';
import ReportModal from './ReportModal.jsx';
import SimpleLineChart from '../SimpleLineChart.jsx';
import CompareModal from '../compare/CompareModal.jsx';
import {
  addToFavourites,
  deleteFromFavourites,
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
  getCompanyFromRecentlyViewed
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


const Company = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { companyId, companyName, initialFramework, selectedIndustry } = location.state || {};
  const { companyId: initialCompanyId, companyName: initialCompanyName, initialFramework, selectedIndustry } = location.state || {};
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const stateCompanyName1 = location.state?.companyName;
  const displayCompanyName = companyName || stateCompanyName1;
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
  const [companyId1, setCompanyId1] = useState(null);
  const [companyName1, setCompanyName1] = useState(null);

  const [graphStateChange, setGraphStateChange] = useState(false);
  const [ticker, setTicker] = useState(null);
  const [companyId, setCompanyId] = useState(initialCompanyId);
  console.log("Initial Framework:", initialFramework);


  useEffect(() => {
    if (initialCompanyId) {
      setCompanyId(initialCompanyId); 
    } else {
      const asyncGetId = async () => {
        let url = window.location.href;
        let companyIdActual = url.split("/");
        setCompanyId(Number(companyIdActual[companyIdActual.length - 1]));
        const name = await getCompanyFromRecentlyViewed(Number(companyIdActual[companyIdActual.length - 1]));
        setCompanyName(name.company_name);
        setTicker(name.ticker);
        console.log(name);
      }
      asyncGetId();
    }
  }, [initialCompanyId]);

  

  const [frameworkDisplay, setFrameworkDisplay] = useState('tabular');
  // useEffect(() => {
  //   console.log(lockedSliders);
  // }, [lockedSliders]);
  const [indicatorWeightMapping, setIndicatorWeightMapping] = useState({});

  const latestSliderValuesIndicatorRef = useRef(sliderValuesIndicator);
  const metricNamesRef = useRef();

  useEffect(() => {
    metricNamesRef.current = metricNames;
  }, [metricNames]);

  useEffect(() => {
    latestSliderValuesIndicatorRef.current = sliderValuesIndicator;
  }, [sliderValuesIndicator]);

  useEffect(() => {
    console.log(allIndicatorsInfo);
  }, [allIndicatorsInfo]);

  useEffect(() => {
    console.log(eScore);
  }, [eScore]);


  useEffect(() => {
    console.log(sScore);
  }, [sScore]);


  useEffect(() => {
    console.log(gScore);
  }, [gScore]);


  useEffect(() => {
    const fetchCompanyIndicators = async(companyName) => {
      const allMetricsAvailable = await getAllMetricsAvailable();
      setAllMetrics(allMetricsAvailable);
      const allIndicators1 = await getAllIndicators();
      setAllIndicatorsInfo(allIndicators1);
      const companyIndicators = await getIndicatorInfo(companyName);
      console.log(companyIndicators);
      setIndicatorsCompany(companyIndicators);
      const years = Object.keys(companyIndicators);
      console.log(years);
      years.push('Predicted');
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[years.length - 2]); 
      }
      console.log(selectedFramework);
    };

    const alternativeFetch = async () => {
      let url = window.location.href;
      let companyIdActual = url.split("/");
      setCompanyId(Number(companyIdActual[companyIdActual.length - 1]));
      const name = await getCompanyFromRecentlyViewed(Number(companyIdActual[companyIdActual.length - 1]));
      setCompanyName(name.company_name);
      setTicker(name.ticker);

      const allMetricsAvailable = await getAllMetricsAvailable();
      setAllMetrics(allMetricsAvailable);
      const allIndicators1 = await getAllIndicators();
      setAllIndicatorsInfo(allIndicators1);
      const companyIndicators = await getIndicatorInfo(name.company_name);
      console.log(companyIndicators);
      setIndicatorsCompany(companyIndicators);
      const years = Object.keys(companyIndicators);
      console.log(years);
      years.push('Predicted');
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[years.length - 2]); 
      }
    }

    if (companyId && companyName) {
      console.log(selectedFramework);
      fetchCompanyIndicators(companyName);
    } else {
      alternativeFetch();
    }
    
  }, []);


  useEffect(() => {
    console.log(availableYears);
  }, [availableYears]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('here');
      await addToRecentlyViewed(companyId);

      const availableOfficialFramework = await getOfficialFrameworks();
      console.log(availableOfficialFramework);
      setOfficialFrameworks(availableOfficialFramework);

    };


    const fetchLists = async () => {
      const favsList = await getFavouritesList();
      console.log('FAVS LIST:');
      console.log(favsList);
      const listSearch = favsList.find(item => item.company_id === companyId);
      if (listSearch) {
        console.log('IN FAVS');
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

  useEffect(() => {
    console.log(companyId);
  }, [companyId]);

  useEffect(() => {
    console.log("Selected Framework on Update:", selectedFramework);
  }, [selectedFramework]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('hereeee');
      if (selectedFramework) {
        console.log(selectedFramework);
        const metrics = await getMetricForFramework(selectedFramework);
        console.log(metrics);
        if (metrics) {
          const nameOfMetrics = [];
          const metricIds = [];
          for (const item of Object.values(metrics)) {
            const name = await getMetricName(item.metric_id);
            console.log(name);
            nameOfMetrics.push({ id: item.metric_id, name: name, category: item.category, weighting: item.weighting });
            metricIds.push(item.metric_id);
          }
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

          const initialSliderValues = {};
          for (let id of metricIds) {
            initialSliderValues[id] = metrics.find(item => item.metric_id === id).weighting;
          }
          setSliderValues(initialSliderValues);
          setSliderValuesFixed(initialSliderValues);

          const initialSliderValuesIndicator = {};
          // Object.values(newSelectedIndicators).flatMap(arr => arr).forEach(entry => {
          //   const weighting = Object.values(newAllIndicators).flatMap(arr => arr).find(obj => obj.indicator_id === entry).weighting;
          //   initialSliderValuesIndicator[entry] = weighting;
          // });
          Object.entries(newSelectedIndicators).forEach(([key, arr]) => {
            arr.forEach(entry => {
              const weighting = Object.values(newAllIndicators).flatMap(arr => arr).find(obj => obj.indicator_id === entry).weighting;
              initialSliderValuesIndicator[`${key}-${entry}`] = weighting;
              // console.log(`Key: ${key}, Entry: ${entry}, Weighting: ${weighting}`);
            });
          });
          console.log(initialSliderValuesIndicator);
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
        console.log(selectedMetrics.length);
        // const indicatorsInfo = allIndicators[idMetric];
        const indicatorsInfo = await getIndicatorFromMetric(idMetric);
        console.log(`${idMetric} - ${indicatorsInfo}`);

        const newObj = indicatorsInfo.reduce((acc, indicator) => {
          acc[indicator.indicator_name] = indicator.weighting;
          return acc;
        }, {});

        console.log(newObj);
        let correspondingScore;
        if (selectedYear !== 'Predicted') {
          correspondingScore = await getMetricScoreByYear(indicatorsCompany[selectedYear], newObj);
          if (isNaN(correspondingScore)) {
            correspondingScore = 0;
          }
        } else {
          correspondingScore = 0;
        }        
        console.log(correspondingScore);
        
        let obj1 = {};
        obj1["score"] = correspondingScore;
        metricScoreMock[idMetric] = obj1;
      }

      setMetricScores(metricScoreMock);
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

  useEffect(() => {
    console.log(indicatorWeightMapping);
  }, [indicatorWeightMapping]);

  useEffect(() => {
    console.log(metricScores);
  }, [metricScores]);
  
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
    console.log(metricScoreMockReduced);
    return metricScoreMockReduced;

  }

  useEffect(() => {
    console.log(metricNamesFixed);
  }, [metricNamesFixed]);

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

  const handleCloseWatchList = () => {
    setWatchlistModalOpen(false);
  };

  const handleCloseReportModal = () => {
    setOpenReportModal(false);
  }

  useEffect(() => {
    console.log(metricNames);
  }, [metricNames]);
  // useEffect(() => {
  // }, [allIndicators]);
 
  useEffect(() => {
    console.log(sliderValues);
  }, [sliderValues]);

  useEffect(() => {
    console.log(selectedMetrics);
  }, [selectedMetrics]);

  useEffect(() => {
    console.log(selectedIndicators);
  }, [selectedIndicators]);

  useEffect(() => {
    console.log(allIndicators);
  }, [allIndicators]);  

  // useEffect(() => {
  //   console.log(lockedSlidersIndicators);
  // }, [lockedSlidersIndicators])  

  // useEffect(() => {
  //   console.log(errorE);
  // }, [errorE]);

  useEffect(() => {
    console.log(sliderValuesIndicator);
  }, [sliderValuesIndicator]);

  return (
    <Box>
      <Navbar  /*sx={{ width: `calc(100% - ${240}px)`, ml: `${240}px` }}*//>
      <Box sx={{
        height: 'calc(100vh - 5vh)',
        display: 'flex',
        position: 'relative',
      }}>
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
            setSliderValuesFixed={setSliderValuesFixed}
            setSliderValuesIndicatorFixed={setSliderValuesIndicatorFixed}
            setFrameworkDisplay={setFrameworkDisplay}
            setMetricNamesFixed={setMetricNamesFixed}
            setSelectedMetricsFixed={setSelectedMetricsFixed}
            setAllIndicatorsFixed={setAllIndicatorsFixed}
            setSelectedIndicatorsFixed={setSelectedIndicatorsFixed}
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
          // flexGrow: 1, 
          width: '70vw',
          padding: '2vh 1vw 0 1vw',
          overflow: "hidden",
          overflowY: "scroll",
        }}>
          <WatchlistModal isOpen={watchlistModalOpen} handleClose={handleCloseWatchList} companyId={companyId} />
          {/* <ReportModal isOpen={reportModal} handleClose={handleCloseReportModal} companyId={companyId} companyName={companyName} /> */}
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
            sliderValuesIndicator={sliderValuesIndicator}
            selectedMetrics={selectedMetrics}
          />
          <CompanyBody 
            companyId={companyId}
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
            setSliderValuesFixed={setSliderValuesFixed}
            setSliderValuesIndicatorFixed={setSliderValuesIndicatorFixed}
            setFrameworkDisplay={setFrameworkDisplay}
            setMetricNamesFixed={setMetricNamesFixed}
            setSelectedMetricsFixed={setSelectedMetricsFixed}
            setAllIndicatorsFixed={setAllIndicatorsFixed}
            setSelectedIndicatorsFixed={setSelectedIndicatorsFixed}
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
            companyName={companyName}
            ticker={ticker}
          />
          <GraphTableToggle
            display={frameworkDisplay}
            setDisplay={setFrameworkDisplay}
          />
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
          <CreateFramework
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
            setSliderValuesFixed={setSliderValuesFixed}
            setSliderValuesIndicatorFixed={setSliderValuesIndicatorFixed}
            setFrameworkDisplay={setFrameworkDisplay}
            setMetricNamesFixed={setMetricNamesFixed}
            setSelectedMetricsFixed={setSelectedMetricsFixed}
            setAllIndicatorsFixed={setAllIndicatorsFixed}
            setSelectedIndicatorsFixed={setSelectedIndicatorsFixed}
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
            setOfficialFrameworks={setOfficialFrameworks}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Company;
