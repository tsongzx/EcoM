import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  IconButton,
  Input,
  Typography,
  Collapse,
  Card,
  Grid,
  Slider,
  Popover,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import Navbar from '../Navbar.jsx';
import './Company.css';
import WatchlistModal from './WatchlistModal.jsx';
import ReportModal from './ReportModal.jsx';
import SimpleLineChart from '../SimpleLineChart.jsx';
import CompareModal from '../compare/CompareModal.jsx';
import {
  getRecentlyViewed,
  addToFavourites,
  deleteFromFavourites,
  getOfficialFrameworks,
  getMetricForFramework,
  getMetricName,
  getIndicatorsForMetric,
  getIndicatorInfo,
  getMetricScore,
  getFavouritesList,
  getIndustryMean,
  getMetricCategory,
  getAllIndicators,
} from '../helper.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CreateFramework from './CreateFramework.jsx';
import Recommendations from './Recommendations.jsx';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';


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
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [metricNames, setMetricNames] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [allIndicators, setAllIndicators] = useState({});
  const [allIndicatorsInfo, setAllIndicatorsInfo] = useState({});
  const [selectedIndicators, setSelectedIndicators] = useState({});
  const [expandedMetrics, setExpandedMetrics] = useState({});
  const [tableCollapsed, setTableCollapsed] = useState(true);
  const [indicatorsCompany, setIndicatorsCompany] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const token = Cookies.get('authToken');

  const [sliderValues, setSliderValues] = useState({});
  const [sliderValuesIndicator, setSliderValuesIndicator] = useState({});
  const [lockedSliders, setLockedSliders] = useState({});
  const [lockedSlidersIndicators, setLockedSlidersIndicators] = useState({}); 
  const [errorE, setErrorE] = useState('');
  const [errorS, setErrorS] = useState('');
  const [errorG, setErrorG] = useState('');


  const [isLockedE, setIsLockedE] = useState(false);
  const [isLockedS, setIsLockedS] = useState(false);
  const [isLockedG, setIsLockedG] = useState(false);

  const [errorMetrics, setErrorMetrics] = useState({});
  const [errorPillarModal, setErrorPillarModal] = useState('');

  const [pillarWeighting, setPillarWeighting] = useState({ E: 0.333333, S: 0.333333, G: 0.333333 });
  const [editMode, setEditMode] = useState({ E: false, S: false, G: false });

  const [modalE, setModalE] = useState(pillarWeighting['E']);
  const [modalS, setModalS] = useState(pillarWeighting['S']);
  const [modalG, setModalG] = useState(pillarWeighting['G']);

  const [modalOpen, setModalOpen] = useState(false);

  // For resetting to default
  const [metricNamesFixed, setMetricNamesFixed] = useState(null);
  const [selectedMetricsFixed, setSelectedMetricsFixed] = useState(null);
  const [allIndicatorsFixed, setAllIndicatorsFixed] = useState(null);
  const [selectedIndicatorsFixed, setSelectedIndicatorsFixed] = useState(null);
  const [sliderValuesFixed, setSliderValuesFixed] = useState(null);
  const [sliderValuesIndicatorFixed, setSliderValuesIndicatorFixed] = useState(null);
  const [triggerSource, setTriggerSource] = useState(false);

  const resetToDefault = () => {
    setTriggerSource(true);
    setMetricNames(metricNamesFixed);
    setSelectedMetrics(selectedMetricsFixed);
    setAllIndicators(allIndicatorsFixed);
    setSelectedIndicators(selectedIndicatorsFixed);
    // setSliderValuesFixed(sliderValuesFixed);
    // setSliderValuesIndicatorFixed(sliderValuesIndicatorFixed);
  }

  const loadIndicatorInfo = (indicatorId) => {
    const description = allIndicatorsInfo.find(obj => obj.id === indicatorId).description;
    return description;
  }

  const checkPillarWeighting = () => {
    const decimalRegex = /^[0-9]+(\.[0-9]+)?$/;
    if ((!decimalRegex.test(modalE) || !decimalRegex.test(modalS) || !decimalRegex.test(modalG))) {
      setErrorPillarModal('Please ensure all fields contain a value from 0 to 1.')
    } else if (isNaN(parseFloat(modalE)) || isNaN(parseFloat(modalS)) || isNaN(parseFloat(modalG))) {
      setErrorPillarModal('Please ensure all fields contain a value from 0 to 1.')
    } else {
      let cumSum = parseFloat(modalE) + parseFloat(modalS) + parseFloat(modalG);
      if (cumSum <= 0.999999 || cumSum >= 1.000001) {
        setErrorPillarModal('Please ensure that all weightings add up to 1.');
      } else {
        let newPillarWeighting = {};
        newPillarWeighting['E'] = modalE;
        newPillarWeighting['S'] = modalS;
        newPillarWeighting['G'] = modalG;

        setPillarWeighting(newPillarWeighting);
        setModalOpen(false);
        setErrorPillarModal('');
      }
    }
  }


  useEffect(() => {
    console.log(lockedSliders);
  }, [lockedSliders]);

  useEffect(() => {
    console.log(allIndicatorsInfo);
  }, [allIndicatorsInfo]);

  useEffect(() => {
    const fetchCompanyIndicators = async(companyName) => {
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

  useEffect(() => {
    console.log(metricNames);
  }, [metricNames]);


  const setData = async() => {
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
  useEffect(() => {
    setData();
  }, [companyId]);

  

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
          Object.values(newSelectedIndicators).flatMap(arr => arr).forEach(entry => {
            // const weighting = Object.values(newAllIndicators).flatMap(arr => arr).find(obj => obj.id === entry)?.weighting;
            const weighting = Object.values(newAllIndicators).flatMap(arr => arr).find(obj => obj.indicator_id === entry).weighting;
            initialSliderValuesIndicator[entry] = weighting;
          });
          console.log(initialSliderValuesIndicator);
          setSliderValuesIndicator(initialSliderValuesIndicator);
          setSliderValuesIndicatorFixed(initialSliderValuesIndicator);
        }
      }
    };
    fetchData();
  }, [selectedFramework]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClick1 = () => {
    setExpanded1(!expanded1);
  };

  const handleMetricExpandClick = (metricId) => {
    setExpandedMetrics((prev) => ({
      ...prev,
      [metricId]: !prev[metricId]
    }));
  };

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

  const handleReturn = () => {
    navigate('/dashboard');
  };

  const openWatchlistModal = () => {
    setWatchlistModalOpen(true);
  };

  const handleCloseWatchList = () => {
    setWatchlistModalOpen(false);
  };

  const openCompareModal = () => {
    setCompareModalOpen(true);
  };

  const openReportModal = () => {
    setOpenReportModal(true);
  }

  const handleCloseReportModal = () => {
    setOpenReportModal(false);
  }

  const handleToggleFavourite = () => {
    const companyId_int = Number(companyId);
    if (!isInFavs) {
      addToFavourites(companyId_int);
    } else {
      deleteFromFavourites(companyId_int);
    }
    setIsInFavs(!isInFavs);
  };

  const handleFrameworkChange = async (event) => {
    const frameworkId = Number(event.target.value) + 1;
    setSelectedFramework(frameworkId);

    const metrics = await getMetricForFramework(true, frameworkId);
    if (metrics) {
      const nameOfMetrics = [];
      const metricIds = [];
      for (const item of Object.values(metrics)) {
        const name = await getMetricName(item.metric_id);
        nameOfMetrics.push({ id: item.metric_id, name: name });
        metricIds.push(item.metric_id);
      }
      setMetricNames(nameOfMetrics);
      
      setSelectedMetrics(metricIds);
      
      const newAllIndicators = {};
      for (const id of metricIds) {
        try {
          const indicators = await getIndicatorsForMetric(selectedFramework, id);
          newAllIndicators[id] = indicators;
        } catch (error) {
          console.log(error);
        }
      }
      setAllIndicators(newAllIndicators);
      
      const newSelectedIndicators = {};
      for (const id of metricIds) {
        console.log(id);
        newSelectedIndicators[id] = newAllIndicators[id].map(indicator => indicator.indicator_id);
      }
      console.log(newSelectedIndicators);
      setSelectedIndicators(newSelectedIndicators);
    }
  };

  useEffect(() => {
  }, [allIndicators]);

  const handleMetricChange = async (event) => {
    const metricId = Number(event.target.value);
  
    let newSelectedIndicators = { ...selectedIndicators };
    let newSelectedMetrics = [...selectedMetrics];
  
    if (selectedMetrics.includes(metricId)) {
      newSelectedMetrics = selectedMetrics.filter((id) => id !== metricId);
      delete newSelectedIndicators[metricId];
    } else {
      newSelectedMetrics = [...selectedMetrics, metricId];
      newSelectedIndicators[metricId] = allIndicators[metricId].map(indicator => indicator.indicator_id);
    }
    setSelectedMetrics(newSelectedMetrics);
    setSelectedIndicators(newSelectedIndicators);
  };

  const handleIndicatorChange = (event, metricId) => {
    const indicatorId = Number(event.target.value);
    
    setSelectedIndicators((prevSelectedIndicators) => {
      const metricIndicators = prevSelectedIndicators[metricId] || [];
      const isSelected = metricIndicators.includes(indicatorId);
      
      const updatedIndicators = isSelected
        ? metricIndicators.filter((id) => id !== indicatorId)
        : [...metricIndicators, indicatorId];
      
      const newIndicators = {
        ...prevSelectedIndicators,
        [metricId]: updatedIndicators.length > 0 ? updatedIndicators : undefined,
      };
      
      const result = Object.fromEntries(
        Object.entries(newIndicators).filter(([_, indicators]) => indicators !== undefined)
      );
      
      return result;
    });
  };  
  
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

  const findIndicatorValue = (indicatorName) => {
    if (indicatorName in indicatorsCompany[Number(selectedYear)]) {
      return indicatorsCompany[Number(selectedYear)][indicatorName]['indicator_value'];
    } else {
      return ' ';
    }
  }
  
  const handleSliderChange = (metricId, newValue) => {

    const changedMetric = metricNames.find(metric => metric.id === metricId);
    changedMetric.weighting = newValue;
    const category = changedMetric.category;
    const filteredMetrics = metricNames
      .filter(metric => metric.category === category)
      .filter(metric => metric.id !== metricId)
      .filter(metric => selectedMetrics.includes(metric.id))
      .filter(metric => !lockedSliders.hasOwnProperty(metric.id));
    
    console.log(filteredMetrics);
      
    const lockedMetrics = metricNames
      .filter(metric => metric.category === category)
      .filter(metric => metric.id !== metricId)
      .filter(metric => selectedMetrics.includes(metric.id))
      .filter(metric => lockedSliders.hasOwnProperty(metric.id));
    
    let additional = 0;
    lockedMetrics.forEach(metric => {
      additional += sliderValues[metric.id];
    });

    // const additional = lockedMetrics.reduce((sum, metric) => sum + metric.weighting, 0);

    const remainingWeight = 1 - newValue - additional;
    // const totalWeighting = filteredMetrics.reduce((total, item) => total + item.weighting, 0);
    let totalWeighting = 0;
    filteredMetrics.forEach(metric => {
      totalWeighting += sliderValues[metric.id];
    })
    
    // const newWeight = remainingWeight / filteredMetrics.length;
    if (remainingWeight < 0) {
      filteredMetrics.forEach(item =>
        item.weighting = 0
      );
    } else {
      filteredMetrics.forEach(item => {
          console.log(item.weighting);
          item.weighting = remainingWeight * (sliderValues[item.id] / totalWeighting)
        }
      );
    }

    setSliderValues(prevValues => {
      const updatedValues = { ...prevValues };
      filteredMetrics.forEach(item => {
        updatedValues[item.id] = item.weighting;
      });
  
      updatedValues[metricId] = newValue;
      return updatedValues;
    });

  };

  useEffect(() => {

    console.log('here111');
    let newLockedSliders = {};
    let newSliderValues = {};

    // 1. Update Locked sliders
    const keys = Object.keys(lockedSliders).map(key => Number(key));
    console.log(keys);
    console.log(selectedMetrics);

    for (let key of keys) {
      if (selectedMetrics.includes(key)) {
        newLockedSliders[key] = lockedSliders[key];
      }
    }
    console.log(newLockedSliders);

    setLockedSliders(newLockedSliders);

    // 2. Get length of each pillar
    let numE = 0;
    let numS = 0;
    let numG = 0;

    let totalE = 0;
    let totalS = 0;
    let totalG = 0;

    for (let entry of selectedMetrics) {
      let category = metricNames.find(metric => metric.id === entry).category;

      if (sliderValues.hasOwnProperty(entry)) {
        if (category === 'E') {
          totalE += sliderValues[entry];
        } else if (category === 'S') {
          totalS += sliderValues[entry];
        } else {
          totalG += sliderValues[entry];
        }
      } 
    }
    
    let lockedE = 0;
    let lockedS = 0;
    let lockedG = 0;


    for (let entry of selectedMetrics) {
      let category = metricNames.find(metric => metric.id === entry).category;

      if (!lockedSliders.hasOwnProperty(entry) && sliderValues.hasOwnProperty(entry)) {
        if (category === 'E') {
          numE += 1;
        } else if (category === 'S') {
          numS += 1;
        } else {
          numG += 1;
        }
      } else if (lockedSliders.hasOwnProperty(entry) && sliderValues.hasOwnProperty(entry)) {
        if (category === 'E') {
          lockedE += sliderValues[entry];
        } else if (category === 'S') {
          lockedS += sliderValues[entry];
        } else {
          lockedG += sliderValues[entry];
        }
      }
    }

    for (let entry of selectedMetrics) {
      let category = metricNames.find(metric => metric.id === entry).category;

      if (!lockedSliders.hasOwnProperty(entry) && sliderValues.hasOwnProperty(entry)) {
        if (category === 'E') {
          newSliderValues[entry] = (1- lockedE) * sliderValues[entry] / (totalE - lockedE);
        } else if (category === 'S') {
          newSliderValues[entry] = (1- lockedS) * sliderValues[entry] / (totalS - lockedS);
        } else {
          newSliderValues[entry] = (1- lockedG) * sliderValues[entry] / (totalG - lockedG);
        }
      } else if (!lockedSliders.hasOwnProperty(entry) && !sliderValues.hasOwnProperty(entry)) {
        newSliderValues[entry] = 0;
      } else {
        newSliderValues[entry] = sliderValues[entry];
      }

    }

    setSliderValues(newSliderValues);
    
    if (triggerSource === true) {
      setSelectedIndicators(selectedIndicatorsFixed);
      setSliderValues(sliderValuesFixed);
      
    } 

  }, [selectedMetrics, triggerSource]);

  useEffect(() => {
    let newLockedSlidersIndicators = {};
    let newSliderValuesIndicators = {};

    const keys = Object.keys(lockedSlidersIndicators).map(key => Number(key));

    for (let key of keys) {
      if (Object.values(selectedIndicators).some(arr => arr.includes(key))) {
        newLockedSlidersIndicators[key] = lockedSlidersIndicators[key];
      }
    }

    console.log(newLockedSlidersIndicators);

    setLockedSlidersIndicators(newLockedSlidersIndicators);

    Object.entries(selectedIndicators).forEach(([key, arr]) => {
      console.log(arr);
      let unlockedWeighting = 0;
      let lockedWeighting = 0;
      let unlockedIndicators = 0;
      arr.forEach(value => {
        if (!lockedSlidersIndicators.hasOwnProperty(value) && sliderValuesIndicator[value]) {
          unlockedWeighting += sliderValuesIndicator[value];
          unlockedIndicators += 1;
        } else if (lockedSlidersIndicators.hasOwnProperty(value)) {
          lockedWeighting += sliderValuesIndicator[value];
        } else {
          unlockedIndicators += 1;
        }
      });

      console.log(unlockedWeighting);
      arr.forEach(value => {
        if (!lockedSlidersIndicators.hasOwnProperty(value)) {
          newSliderValuesIndicators[value] = (1 - lockedWeighting) / unlockedIndicators;
        } else {
          newSliderValuesIndicators[value] = sliderValuesIndicator[value];
        }
      })
      unlockedWeighting = 0;
      lockedWeighting = 0;
    });

    setSliderValuesIndicator(newSliderValuesIndicators);

    if (triggerSource === true) {
      setSliderValuesIndicator(sliderValuesIndicatorFixed);
      setTriggerSource(false);
    } 
    

  }, [selectedIndicators, triggerSource]);

  const handleLockClick = (id) => {
    setLockedSliders((prevLockedSliders) => {
      const newLockedSliders = { ...prevLockedSliders };
      if (newLockedSliders[id]) {
        delete newLockedSliders[id];
      } else {
        newLockedSliders[id] = true;
      }
      return newLockedSliders;
    });
  };

  const handleLockClickIndicator = (id) => {
    setLockedSlidersIndicators((prevLockedSlidersIndicators) => {
      const newLockedSlidersIndicators = { ...prevLockedSlidersIndicators};
      if (newLockedSlidersIndicators[id]) {
        delete newLockedSlidersIndicators[id];
      } else {
        newLockedSlidersIndicators[id] = true;
      }
      return newLockedSlidersIndicators;
    });
  }

  useEffect(() => {
    console.log(lockedSlidersIndicators);
  }, [lockedSlidersIndicators]);

  const findMaxWeight = (metricId) => {

    const categoryOfInterest = metricNames.find(metric => metric.id === metricId)['category'];
    const lockedMetrics = metricNames
      .filter(metric => metric.category === categoryOfInterest)
      .filter(metric => !selectedMetrics.includes(metric.id))
      .filter(metric => lockedSliders.hasOwnProperty(metric.id));
    
    if (lockedMetrics.length === 0) {
      return 1;
    } else {
      console.log('here');
      const totalWeighting = lockedMetrics.reduce((sum, metric) => sum + metric.weighting, 0);
      return 1 - totalWeighting;
    }
  }

  const getClampedValue = (value, max) => {
    console.log(value);
    console.log(max);
    return Math.min(value, max);
  }

  const checkPillar = (category) => {
    const allMetrics = metricNames
    .filter(metric => metric.category === category)
    .filter(metric => selectedMetrics.includes(metric.id));

    if (allMetrics.length === 0) {
      return;
    }

    console.log(allMetrics);

    let cumWeighting = 0;
    allMetrics.forEach(metric => 
      cumWeighting += metric.weighting
    );

    console.log(cumWeighting);
    if (!(cumWeighting >= 0.9999 && cumWeighting <= 1.0001)) {
      if (category === 'E') {
        setErrorE('Selected Environmental metrics must add up to 1.');
      } else if (category === 'S') {
        setErrorS('Selected Social metrics must add up to 1.');
      } else {
        setErrorG('Selected Governance metrics must add up to 1.');
      }
      
    } else {
      if (category === 'E') {
        setErrorE('');
      } else if (category === 'S') {
        setErrorS('');
      } else {
        setErrorG('');
      }
    }
    
  }

  useEffect(() => {
    console.log(errorE);
  }, [errorE]);

  useEffect(() => {
    console.log(sliderValuesIndicator);
  }, [sliderValuesIndicator]);

  const handleSliderChangeIndicators = (indicatorId, newValue, metricId) => {
    console.log(indicatorId);
    let indicatorsOfSameMetric = allIndicators[metricId];
    indicatorsOfSameMetric = indicatorsOfSameMetric
    .filter(indicator => indicator.indicator_id !== indicatorId)
    .filter(indicator => !lockedSlidersIndicators.hasOwnProperty(indicator.indicator_id));
    
    let lockedIndicators = allIndicators[metricId]
      .filter(indicator => indicator.indicator_id !== indicatorId)
      .filter(indicator => lockedSlidersIndicators.hasOwnProperty(indicator.indicator_id));

    const additional = lockedIndicators.reduce((sum, indicator) => sum + indicator.weighting, 0);

    const remainingWeight = 1 - newValue - additional;
    const totalWeighting = indicatorsOfSameMetric.reduce((total, item) => total + item.weighting, 0);

    console.log(remainingWeight);
    
    if (remainingWeight < 0) {
      indicatorsOfSameMetric.forEach(item => 
        item.weighting = 0
      );
    } else {
      indicatorsOfSameMetric.forEach(item => 
        item.weighting = remainingWeight * (item.weighting / totalWeighting)
      );
    }

    setSliderValuesIndicator(prevValues => {
      const updatedValues = {...prevValues};
      indicatorsOfSameMetric.forEach(item => {
        updatedValues[item.indicator_id] = item.weighting;
      });

      updatedValues[indicatorId] = newValue;
      return updatedValues;
    });

  }

  const checkMetric = (metricId) => {


    let cumSum = 0;
    let errors = {};

    const indicatorsOfConcern = allIndicators[metricId];
    indicatorsOfConcern.forEach(indicator => {
      if (selectedIndicators[metricId].includes(indicator.indicator_id)) {
        console.log(indicator.weighting);
        cumSum += sliderValuesIndicator[indicator.indicator_id];
      }
    });

    console.log(cumSum);

    if (!(cumSum >= 0.9999 && cumSum <= 1.0001)) {
      errors[metricId] = 'Selected indicators must add up to 1.'
    } else {
      errors[metricId] = '';
    }

    setErrorMetrics(prevErrors => ({
      ...prevErrors, 
      ...errors,  
    }));
  }

  const handleCancel = () => {
    setModalOpen(false);
    setModalE(pillarWeighting['E']);
    setModalS(pillarWeighting['S']);
    setModalG(pillarWeighting['G']);
    setErrorPillarModal('');
  };

  const handleWeightingChange = (pillar, value) => {
    const decimalRegex = /^[0-9]+(\.[0-9]+)?$/;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 1 && decimalRegex.test(value)) {
      if (pillar === 'E') {
        setModalE(value);
      } else if (pillar === 'S') {
        setModalS(value);
      } else {
        setModalG(value);
      }
    }
  };

  const renderMetricsByCategory = (category) => {
    if (!metricNames) return null;
  
    const filteredMetrics = metricNames.filter(metric => metric.category === category);
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <FormGroup style={{ marginTop: '10px'}}>
          {filteredMetrics.map((metric) => (
            <div key={metric.id} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  style={{ flexGrow: '1' }}
                  value={metric.id.toString()}
                  control={<Checkbox checked={selectedMetrics.includes(metric.id)} />}
                  label={<span style={{ fontSize: '17px' }}>{metric.name}</span>}
                  onChange={handleMetricChange}
                />
                <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <IconButton
                    onClick={() => handleMetricExpandClick(metric.id)}
                    size="small"
                  >
                    {expandedMetrics[metric.id] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                </div>
                {selectedMetrics.includes(metric.id) && (
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '40%' }}>
                    <Slider
                      sx={{ display: 'flex', marginLeft: '25px', marginRight: '25px' }}
                      value={getClampedValue(sliderValues[metric.id] || 0, lockedSliders.hasOwnProperty(metric.id) ? 1 : findMaxWeight(metric.id))}
                      onChange={(event, newValue) => handleSliderChange(metric.id, newValue)}
                      min={0}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => value.toFixed(6)}
                      disabled={lockedSliders[metric.id]} 
                    />
                    <IconButton onClick={() => handleLockClick(metric.id)} size="small">
                      {lockedSliders[metric.id] ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                    </IconButton>
                  </div>
                )}
              </div>
              <Collapse in={expandedMetrics[metric.id]}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <FormGroup
                    style={{ marginLeft: '30px', marginTop: '10px', display: 'flex', flexDirection: 'column'}}
                    name="indicators"
                    value={selectedIndicators[metric.id] || []}
                  >
                    {allIndicators[metric.id]?.map((indicator) => (
                      <div key={indicator.indicator_id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%'}}>
                          <FormControlLabel
                            key={indicator.indicator_id}
                            value={indicator.indicator_id.toString()}
                            control={
                              <Checkbox
                                checked={selectedIndicators[metric.id]?.includes(indicator.indicator_id) || false}
                                sx={{
                                  color: 'red',
                                  '&.Mui-checked': {
                                    color: 'red',
                                  },
                                }}
                              />
                            }
                            label={indicator.indicator_name}
                            onChange={(event) => handleIndicatorChange(event, metric.id)}
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontSize: '15px', 
                              },
                            }}
                          />
                          <Tooltip placement="right" 
                            title={
                              <Typography variant="h6" sx={{ fontSize: '16px' }}>
                                {loadIndicatorInfo(indicator.indicator_id)}
                              </Typography>
                            }
                          >
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'black',
                                borderRadius: '50%',
                                color: 'white', 
                              }}
                            >
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </div>
                        {selectedIndicators.hasOwnProperty(metric.id) && selectedIndicators[metric.id].includes(indicator.indicator_id) && (
                          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Slider
                              sx={{
                                display: 'flex',
                                marginLeft: '25px',
                                marginRight: '25px',
                                marginTop: '5px',
                                '& .MuiSlider-thumb': {
                                  color: lockedSlidersIndicators[indicator.indicator_id] ? 'gray' : 'red',
                                },
                                '& .MuiSlider-track': {
                                  color: lockedSlidersIndicators[indicator.indicator_id] ? 'gray' : 'red',
                                },
                                '& .MuiSlider-rail': {
                                  color: lockedSlidersIndicators[indicator.indicator_id] ? 'gray' : 'red',
                                },
                              }}
                              value={sliderValuesIndicator[indicator.indicator_id] || 0}
                              onChange={(event, newValue) => handleSliderChangeIndicators(indicator.indicator_id, newValue, metric.id)}
                              min={0}
                              max={1}
                              step={0.01}
                              valueLabelDisplay="auto"
                              valueLabelFormat={(value) => value.toFixed(6)}
                              disabled={lockedSlidersIndicators[indicator.indicator_id]} 
                            />
                            <IconButton onClick={() => handleLockClickIndicator(indicator.indicator_id)} size="small">
                              {lockedSlidersIndicators[indicator.indicator_id] ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                            </IconButton>
                          </div>
                        )}
                      </div>
                    ))}
                  </FormGroup>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: '30px', marginTop: '10px'}}>
                    <Button variant="contained" color="error" onClick={() => checkMetric(metric.id)}>Check</Button>
                    {(`${!errorMetrics[metric.id]}` || errorMetrics[metric.id] !== '') && <div style={{ color: 'red', marginLeft: '15px' }}>{errorMetrics[metric.id]}</div>}
                  </div>
                </div>
              </Collapse>
            </div>
          ))}
          <Button variant="contained" color="primary" onClick={() => checkPillar(category)}>Check</Button>
        </FormGroup>
      </div>

    );
  };

  const handleClickReport = () => {
    navigate(`/report/${companyId}`, 
      { state: { 
          id: companyId, 
          companyName,
          framework: selectedFramework,
          year: selectedYear,
        } 
      });
  }

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: '100px'}}>
        <Button variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={handleReturn}>
          Return to Dashboard
        </Button>
        <WatchlistModal isOpen={watchlistModalOpen} handleClose={handleCloseWatchList} companyId={companyId} />
        <ReportModal isOpen={reportModal} handleClose={handleCloseReportModal} companyId={companyId} companyName={companyName} />
        <div className="companyHeading">
          <div className="metainfoContainer">
            <div className="companyName metainfo">
              <h1>{companyName}</h1>
            </div>
            <div className="currentPrice metainfo">
              <h2>58.78</h2>
              <p>current price</p>
            </div>
            <div className="esgScore metainfo">
              <h2>80.1</h2>
              <p>ESG Score</p>
            </div>
          </div>
          <div className="quickControls">
            <Button onClick={handleClickReport}>Save Report</Button>
            <Button onClick={openReportModal}>Save Report</Button>
            <Button onClick={handleToggleFavourite}>{isInFavs ? 'unlike' : 'like'}</Button>
          </div>
        </div>
        <div className="chartAndReccomendations">
          <div className="chart">
            <SimpleLineChart />
            <div className="chartControls">
              <Button onClick={openWatchlistModal}>Add to List</Button>
              <Button>AI Predict</Button>
              <Button onClick={openCompareModal}>Compare</Button>
            </div>
          </div>
          <Recommendations companyId={companyId} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <div style={{ width: '45%', display: 'flex', flexDirection: 'column'}}>
            <Card style={{ marginTop: '20px', marginLeft: '40px'}}>
              <FormControl style={{ marginLeft: '20px', cursor: 'pointer' }} component="fieldset">
                <FormLabel component="legend" onClick={handleExpandClick}>
                  Select Framework
                  <IconButton onClick={handleExpandClick} size="small">
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </FormLabel>
                <Collapse in={expanded}>
                  <RadioGroup
                    aria-labelledby="select-framework-radio-buttons-group"
                    name="select-framework-radio-buttons-group"
                    value={selectedFramework ? String(selectedFramework - 1) : ''}
                    onChange={handleFrameworkChange}
                  >
                    {officialFrameworks &&
                      Object.entries(officialFrameworks).map(([key, framework]) => (
                        <FormControlLabel key={key} value={key} control={<Radio />} label={<span style={{ fontSize: '17px' }}>{framework.framework_name}</span>} />
                      ))}
                  </RadioGroup>
                </Collapse>
              </FormControl>
            </Card>
            <Card style={{ marginTop: '100px', marginLeft: '40px' }}>
              <FormControl style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', flex: '1' }} component="fieldset">
                <FormLabel component="legend" onClick={handleExpandClick1} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Metrics and Indicators
                  <IconButton onClick={handleExpandClick1} size="small">
                    {expanded1 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </FormLabel>
                <Collapse in={expanded1}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px'}}>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3 style={{ fontSize: '25px', fontFamily: 'Roboto' }}>Environmental</h3>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                          <Button variant="outlined" style={{
                            borderRadius: '30%', 
                            aspectRatio: '2 / 1',
                            borderWidth: '3px',
                            marginRight: '20px',
                          }} onClick={() => setModalOpen(true)} disabled={isLockedE}>{pillarWeighting['E']}</Button>
                          <IconButton 
                            onClick={() => setIsLockedE(prevState => !prevState)} 
                            size="small"
                          >
                            {isLockedE ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                          </IconButton>
                        </div>
                      </div>
                      {renderMetricsByCategory('E')}
                      {`${errorE}` && <div style={{ color: 'red', marginTop: '10px', display: 'flex', justifyContent: 'center' }}>{errorE}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px'}}>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3 style={{ fontSize: '25px', fontFamily: 'Roboto' }}>Social</h3>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                          <Button variant="outlined" style={{
                            borderRadius: '30%', 
                            aspectRatio: '2 / 1',
                            borderWidth: '3px',
                            marginRight: '20px'
                          }} onClick={() => setModalOpen(true)} disabled={isLockedS}>{pillarWeighting['S']}</Button>
                          <IconButton 
                            onClick={() => setIsLockedS(prevState => !prevState)} 
                            size="small"
                          >
                            {isLockedS ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                          </IconButton>
                        </div>
                      </div>
                      {renderMetricsByCategory('S')}
                      {`${errorS}` && <div style={{ color: 'red', marginTop: '10px', display: 'flex', justifyContent: 'center' }}>{errorS}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px'}}>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3 style={{ fontSize: '25px', fontFamily: 'Roboto' }}>Governance</h3>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                          <Button variant="outlined" style={{
                            borderRadius: '30%', 
                            aspectRatio: '2 / 1',
                            borderWidth: '3px',
                            marginRight: '20px'
                          }} onClick={() => setModalOpen(true)} disabled={isLockedG}>{pillarWeighting['G']}</Button>
                          <IconButton 
                            onClick={() => setIsLockedG(prevState => !prevState)} 
                            size="small"
                          >
                            {isLockedG ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                          </IconButton>
                        </div>
                      </div>
                      {renderMetricsByCategory('G')}
                      {`${errorG}` && <div style={{ color: 'red', marginTop: '10px', display: 'flex', justifyContent: 'center' }}>{errorG}</div>}
                    </div>
                  </div>
                  <Dialog maxWidth="xs" fullWidth open={modalOpen} onClose={() => setModalOpen(false)}>
                    <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}>
                      Edit Pillar Weighting
                    </DialogTitle>
                    <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography style={{ flexShrink: 0 }}>Environmental</Typography>
                        <TextField
                          value={isLockedE ? `${modalE} (locked)` : modalE}
                          onChange={(e) => handleWeightingChange('E', e.target.value)}
                          autoFocus
                          style={{ 
                            backgroundColor: isLockedE ? '#f0f0f0' : 'white',
                            cursor: isLockedE ? 'not-allowed' : 'text',
                            border: isLockedE ? '1px solid #ccc' : '1px solid #000',
                            width: '200px',
                          }}
                          inputProps={{
                            pattern: /^[0-9]+(\.[0-9]+)?$/, // Regular expression for numeric input
                            min: 0,                       // Minimum value allowed
                            max: 1,                       // Maximum value allowed
                            step: 0.01,                   // Step interval
                            inputMode: 'decimal'          // Input mode for decimal numbers
                          }}
                          disabled={isLockedE}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography style={{ flexShrink: 0 }}>Social</Typography>
                        <TextField
                          value={isLockedS ? `${modalS} (locked)` : modalS}
                          onChange={(e) => handleWeightingChange('S', e.target.value)}
                          style={{ 
                            backgroundColor: isLockedS ? '#f0f0f0' : 'white',
                            cursor: isLockedS ? 'not-allowed' : 'text',
                            border: isLockedS ? '1px solid #ccc' : '1px solid #000',
                            width: '200px',
                          }}
                          inputProps={{
                            pattern: /^[0-9]+(\.[0-9]+)?$/, // Regular expression for numeric input
                            min: 0,                       // Minimum value allowed
                            max: 1,                       // Maximum value allowed
                            step: 0.01,                   // Step interval
                            inputMode: 'decimal'          // Input mode for decimal numbers
                          }}
                          disabled={isLockedS}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography style={{ flexShrink: 0 }}>Governance</Typography>
                        <TextField
                          value={isLockedG ? `${modalG} (locked)` : modalG}
                          onChange={(e) => handleWeightingChange('G', e.target.value)}
                          style={{ 
                            backgroundColor: isLockedG ? '#f0f0f0' : 'white',
                            cursor: isLockedG ? 'not-allowed' : 'text',
                            border: isLockedG ? '1px solid #ccc' : '1px solid #000',
                            width: '200px',
                          }}
                          inputProps={{
                            pattern: /^[0-9]+(\.[0-9]+)?$/, // Regular expression for numeric input
                            min: 0,                       // Minimum value allowed
                            max: 1,                       // Maximum value allowed
                            step: 0.01,                   // Step interval
                            inputMode: 'decimal'          // Input mode for decimal numbers
                          }}
                          disabled={isLockedG}
                        />
                      </div>
                      {`${errorPillarModal}` && <div style={{ color: 'red', marginTop: '10px', display: 'flex', justifyContent: 'center' }}>{errorPillarModal}</div>}
                      <DialogActions style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px'}}>
                        <Button variant="outlined" onClick={() => handleCancel()} color="primary">Cancel</Button>
                        <Button variant="outlined" onClick={() => checkPillarWeighting()} color="primary">Save</Button>
                      </DialogActions>
                    </DialogContent>
                  </Dialog>

                  {Object.keys(selectedIndicators).length > 0 && (
                    <div style={{ marginLeft: '20px', marginTop: '100px', marginBottom: '40px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Button variant="contained" color="primary">
                        Calculate Score
                      </Button>
                      <Button variant="contained" color="primary" onClick={resetToDefault}>
                        Reset to Default
                      </Button>
                    </div>
                  )}
                </Collapse>
              </FormControl>
            </Card>
          </div>

          <div style={{ width: '50%', marginTop: '20px', marginRight: '40px'}}>
            <Card style={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
              <IconButton onClick={() => setTableCollapsed(!tableCollapsed)} size="large">
                See table
                {tableCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
              <Collapse in={!tableCollapsed}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <h2>{companyName}</h2>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    {availableYears.map((year) => (
                      <Button key={year} onClick={() => handleYearChange(year)}>
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>
                {selectedFramework && (
                  <Grid container justifyContent="center">
                    <TableContainer component={Paper} style={{ border: '1px solid #ddd', width: '90%' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ borderRight: '1px solid #ddd' }}>Metric</TableCell>
                            <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ddd' }}>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(selectedIndicators).map(([metricId, indicatorIds]) => {
                            const metricName = metricNames.find(m => m.id === Number(metricId))?.name || 'Unknown Metric';
                            const indicators = allIndicators[metricId] || [];
                            return (
                              indicatorIds.map((indicatorId, index) => {
                                const indicator = indicators.find(ind => ind.indicator_id === indicatorId);
                                return (
                                  <TableRow key={`${metricId}-${indicatorId}`}>
                                    {index === 0 && (
                                      <TableCell
                                        rowSpan={indicatorIds.length}
                                        style={{ borderRight: '1px solid #ddd' }}
                                      >
                                        {metricName}
                                      </TableCell>
                                    )}
                                    <TableCell style={{ borderRight: '1px solid #ddd' }}>
                                      {indicator ? indicator.indicator_name : ' '}
                                    </TableCell>
                                    <TableCell style={{ borderBottom: '1px solid #ddd' }}>
                                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        {indicator ? findIndicatorValue(indicator.indicator_name) : ' '}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}

                {!selectedFramework && (
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    {selectedYear && indicatorsCompany[selectedYear] && (
                      <TableContainer component={Paper} style={{ marginTop: '40px' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Indicator Name</TableCell>
                              <TableCell>Indicator Value</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.values(indicatorsCompany[selectedYear]).map((indicator, index) => (
                              <TableRow key={index}>
                                <TableCell>{indicator.indicator_name}</TableCell>
                                <TableCell align="right">{indicator.indicator_value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </div>
                )}
              </Collapse>
            </Card>
          </div>
        </div>
        <CompareModal companyId={companyId} companyName={displayCompanyName} isOpen={compareModalOpen} compareModalOpen={compareModalOpen} setCompareModalOpen={setCompareModalOpen} selectedFramework={selectedFramework}/>
        <CreateFramework/>

      </div>
    </>
  );
};

export default Company;
