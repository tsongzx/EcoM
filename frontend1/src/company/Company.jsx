import React, { useEffect, useState } from 'react';
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
  getAllMetricsAvailable
} from '../helper.js';
import axios from 'axios';
import Cookies from 'js-cookie';

import CreateFramework from './CreateFramework.jsx';
import LeftPanel from './LeftPanel.jsx';
import FrameworkTable from './FrameworkTable';
import CompanyHeader from './CompanyHeader.jsx';
import CompanyBody from './CompanyBody.jsx';
import GraphTableToggle from './GraphTableToggle.jsx';
import Visualisations from './visualisations/Visualisations.jsx';


const Company = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { companyId, companyName, initialFramework, selectedIndustry } = location.state || {};
  const stateCompanyName = location.state?.companyName;
  const displayCompanyName = companyName || stateCompanyName;
  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [reportModal, setOpenReportModal] = useState(false);
  const [isInFavs, setIsInFavs] = useState(false);
  const [officialFrameworks, setOfficialFrameworks] = useState(null);
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

  const [frameworkDisplay, setFrameworkDisplay] = useState('tabular');
  // useEffect(() => {
  //   console.log(lockedSliders);
  // }, [lockedSliders]);

  useEffect(() => {
    console.log(allIndicatorsInfo);
  }, [allIndicatorsInfo]);

  useEffect(() => {
    const fetchCompanyIndicators = async(companyName) => {
      const allMetricsAvailable = await getAllMetricsAvailable();
      setAllMetrics(allMetricsAvailable);
      const allIndicators1 = await getAllIndicators();
      setAllIndicatorsInfo(allIndicators1);
      const companyIndicators = await getIndicatorInfo(companyName);
      setIndicatorsCompany(companyIndicators);
      const years = Object.keys(companyIndicators);
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[years.length - 1]); 
      }
      
    };

    fetchCompanyIndicators(companyName);
  }, []);

  // useEffect(() => {
  //   console.log(metricNames);
  // }, [metricNames]);

  useEffect(() => {
    const fetchData = async () => {
      await addToRecentlyViewed(companyId);
      // const recentList = await ();
      // if (Array.isArray(recentList) && recentList.includes(companyId)) {
      //   console.log('company is in Favourites/ watchlist');
      // } else {
      //   console.log('company is NOT IN Favourites/ watchlist');
      // }

      const availableOfficialFramework = await getOfficialFrameworks();
      setOfficialFrameworks(availableOfficialFramework);
    };
    fetchData();

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
    fetchLists();
  }, [companyId]);

  

  useEffect(() => {
    const fetchData = async () => {
      console.log('hereeee');
      if (selectedFramework) {
        console.log(selectedFramework);
        const metrics = await getMetricForFramework(selectedFramework);
        if (metrics) {
          const nameOfMetrics = [];
          const metricIds = [];
          for (const item of Object.values(metrics)) {
            const name = await getMetricName(item.metric_id);
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
          />
          <CompanyBody companyId={companyId}/>
          <GraphTableToggle
            frameworkDisplay={frameworkDisplay}
            setFrameworkDisplay={setFrameworkDisplay}
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
          />}
          {frameworkDisplay === 'graphical' && indicatorsCompany ? (<Visualisations companyIndicators={indicatorsCompany} companyName={companyName}/>) : null }
          <CompareModal companyId={companyId} companyName={displayCompanyName} isOpen={compareModalOpen} compareModalOpen={compareModalOpen} setCompareModalOpen={setCompareModalOpen} selectedFramework={selectedFramework}/>
          <CreateFramework/>
        </Box>
      </Box>
    </Box>
  );
};

export default Company;
