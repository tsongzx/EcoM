import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  IconButton,
  Collapse,
  Card,
  Grid,
  Slider,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../Navbar.jsx';
import './Company.css';
import WatchlistModal from './WatchlistModal.jsx';
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
  getMetricCategory
} from '../helper.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CreateFramework from './CreateFramework.jsx';
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
  const [isInFavs, setIsInFavs] = useState(false);
  const [officialFrameworks, setOfficialFrameworks] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState(initialFramework);
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [metricNames, setMetricNames] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [allIndicators, setAllIndicators] = useState({});
  const [selectedIndicators, setSelectedIndicators] = useState({});
  const [expandedMetrics, setExpandedMetrics] = useState({});
  const [tableCollapsed, setTableCollapsed] = useState(true);
  const [indicatorsCompany, setIndicatorsCompany] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const token = Cookies.get('authToken');

  const [sliderValues, setSliderValues] = useState({});
  const [lockedSliders, setLockedSliders] = useState({});


  useEffect(() => {
    console.log(lockedSliders);
  }, [lockedSliders]);

  useEffect(() => {
    const fetchCompanyIndicators = async(companyName) => {
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


  useEffect(async() => {
    const fetchData = async () => {
      await addToRecentlyViewed(companyId);
      const recentList = await getRecentlyViewed();
      if (Array.isArray(recentList) && recentList.includes(companyId)) {
        setIsInFavs(true);
      } else {
        setIsInFavs(false);
      }

      const availableOfficialFramework = await getOfficialFrameworks();
      setOfficialFrameworks(availableOfficialFramework);
    };
    fetchData();

    const favsList = await getFavouritesList();
    if (Array.isArray(favsList) && favsList.includes(companyId)) {
      setIsInFavs(true);
    } else {
      setIsInFavs(false);
    }
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
          setSelectedMetrics(metricIds);
          
          const newAllIndicators = {};
          for (let id of metricIds) {
            const indicators = await getIndicatorsForMetric(parseInt(selectedFramework), parseInt(id));
            newAllIndicators[id] = indicators;
          }

          setAllIndicators(newAllIndicators);
          
          const newSelectedIndicators = {};
          for (const id of metricIds) {
            newSelectedIndicators[id] = newAllIndicators[id].map(indicator => indicator.indicator_id);
          }
          setSelectedIndicators(newSelectedIndicators);

          const initialSliderValues = {};
          for (let id of metricIds) {
            initialSliderValues[id] = metrics.find(item => item.metric_id === id).weighting;
          }
          setSliderValues(initialSliderValues);
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

  const handleToggleFavourite = () => {
    setIsInFavs(!isInFavs);
    const companyId_int = Number(companyId);
    if (isInFavs) {
      addToFavourites(companyId_int);
    } else {
      deleteFromFavourites(companyId_int);
    }
  };

  const handleFrameworkChange = (event) => {
    const frameworkId = Number(event.target.value) + 1;
    setSelectedFramework(frameworkId);
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

    const additional = lockedMetrics.reduce((sum, metric) => sum + metric.weighting, 0);

    const remainingWeight = 1 - newValue - additional;
    
    const newWeight = remainingWeight / filteredMetrics.length;
    filteredMetrics.forEach(item => item.weighting = newWeight);

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

    let maxE = 1;
    let maxS = 1;
    let maxG = 1;

    for (let entry of selectedMetrics) {
      let category = metricNames.find(metric => metric.id === entry).category;

      if (!lockedSliders.hasOwnProperty(entry)) {
        if (category === 'E') {
          numE += 1;
        } else if (category === 'S') {
          numS += 1;
        } else {
          numG += 1;
        }
      } else {
        if (category === 'E') {
          maxE -= sliderValues[entry];
        } else if (category === 'S') {
          maxS -= sliderValues[entry];
        } else {
          maxG -= sliderValues[entry];
        }
      }
    }

    let averageE = maxE / numE;
    let averageS = maxS / numS;
    let averageG = maxG / numG;

    for (let entry of selectedMetrics) {
      let category = metricNames.find(metric => metric.id === entry).category;
      if (!lockedSliders.hasOwnProperty(entry)) {
        if (category === 'E') {
          newSliderValues[entry] = averageE;
        } else if (category === 'S') {
          newSliderValues[entry] = averageS;
        } else {
          newSliderValues[entry] = averageG;
        }
      } else {
        newSliderValues[entry] = sliderValues[entry];
      }
    }

    setSliderValues(newSliderValues);

  }, [selectedMetrics]);

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

  const renderMetricsByCategory = (category) => {
    if (!metricNames) return null;
  
    const filteredMetrics = metricNames.filter(metric => metric.category === category);
  
    return (
      <FormGroup style={{ marginTop: '10px' }}>
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
              <FormGroup
                style={{ marginLeft: '30px' }}
                name="indicators"
                value={selectedIndicators[metric.id] || []}
              >
                {allIndicators[metric.id]?.map((indicator) => (
                  <FormControlLabel
                    key={indicator.indicator_id}
                    value={indicator.indicator_id.toString()}
                    control={<Checkbox checked={selectedIndicators[metric.id]?.includes(indicator.indicator_id) || false} />}
                    label={indicator.indicator_name}
                    onChange={(event) => handleIndicatorChange(event, metric.id)}
                  />
                ))}
              </FormGroup>
            </Collapse>
          </div>
        ))}
      </FormGroup>
    );
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px'}}>
        <Button variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={handleReturn}>
          Return to Dashboard
        </Button>
        <WatchlistModal isOpen={watchlistModalOpen} handleClose={handleCloseWatchList} companyId={companyId} />
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
            <Button>Save Report</Button>
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
          <p>recommendations placeholder</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <div style={{ width: '40%', display: 'flex', flexDirection: 'column'}}>
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
                    <h3 style={{ fontSize: '17px', marginTop: '20px', fontFamily: 'Roboto' }}>Environmental</h3>
                    {renderMetricsByCategory('E')}
                    <h3 style={{ fontSize: '17px', marginTop: '20px', fontFamily: 'Roboto' }}>Social</h3>
                    {renderMetricsByCategory('S')}
                    <h3 style={{ fontSize: '17px', marginTop: '20px', fontFamily: 'Roboto' }}>Governance</h3>
                    {renderMetricsByCategory('G')}
                  </div>

                  {Object.keys(selectedIndicators).length > 0 && (
                    <div style={{ marginLeft: '20px', marginTop: '20px' }}>
                      <Button variant="contained" color="primary">
                        Calculate Score
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
        {/* <CreateFramework/> */}

      </div>
    </>
  );
};

export default Company;
