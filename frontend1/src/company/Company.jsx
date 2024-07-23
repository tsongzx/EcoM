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
  getFrameworkScore,
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
  const [frameworkScore, setFrameworkScore] = useState(null);
  const [metricScore, setMetricScore] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  const [industryMean, setIndustryMean] = useState(null);
  const token = Cookies.get('authToken');

  useEffect(() => {
    console.log(selectedFramework);
    const fetchCompanyIndicators = async(companyName) => {
      const companyIndicators = await getIndicatorInfo(companyName);
      console.log(companyIndicators);
      setIndicatorsCompany(companyIndicators);
      const years = Object.keys(companyIndicators);
      setAvailableYears(years);
      if (years.length > 0) {
        console.log(typeof selectedYear);
        setSelectedYear(years[years.length - 1]); 
      }
      
    };

    fetchCompanyIndicators(companyName);
  }, []);


  useEffect(async() => {
    const fetchData = async () => {
      console.log(companyId);
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
    console.log('FAVS LIST:');
    console.log(favsList);
    if (Array.isArray(favsList) && favsList.includes(companyId)) {
      console.log('IN FAVS');
      setIsInFavs(true);
    } else {
      console.log('NOT IN FAVS');
      setIsInFavs(false);
    }
  }, [companyId]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedFramework) {
        console.log(selectedFramework);
        const metrics = await getMetricForFramework(true, selectedFramework);
        console.log(metrics);
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
          const allMetricScores = {};
          for (const id of metricIds) {
            try {
              const indicators = await getIndicatorsForMetric(id);
              console.log(indicators);
              newAllIndicators[id] = indicators;
              
            } catch (error) {
              console.log(error);
            }
          }
          console.log(newAllIndicators);
          setAllIndicators(newAllIndicators);
          // setMetricScore(allMetricScores);
          
          const newSelectedIndicators = {};
          for (const id of metricIds) {
            newSelectedIndicators[id] = newAllIndicators[id].map(indicator => indicator.indicator_id);
          }
          setSelectedIndicators(newSelectedIndicators);


        }
      }
    };
    fetchData();
  }, [selectedFramework]);

  const handleYearChange = (year) => {
    console.log(year);
    setSelectedYear(year);
  };

  useEffect(() => {
    const fetchIndicators = async () => {
      const newAllIndicators = {};
      for (const id of selectedMetrics) {
        try {
          const indicators = await getIndicatorsForMetric(id);
          newAllIndicators[id] = indicators;
        } catch (error) {
          console.log(error);
        }
      }
      setAllIndicators(newAllIndicators);
    };
    if (selectedMetrics.length > 0) {
      fetchIndicators();
    }
  }, [selectedMetrics]);

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
      console.log(response.data);
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
    //depending on isInFavs, either add or delete from favourites (called WatchList in backend)
    const companyId_int = Number(companyId);
    if (isInFavs) {
      addToFavourites(companyId_int);
    } else {
      deleteFromFavourites(companyId_int);
    }
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

  const handleMetricChange = async (event) => {
    const metricId = Number(event.target.value);
  
    let newSelectedIndicators = { ...selectedIndicators };
    let newSelectedMetrics = [...selectedMetrics];
  
    if (selectedMetrics.includes(metricId)) {
      newSelectedMetrics = selectedMetrics.filter((id) => id !== metricId);
      delete newSelectedIndicators[metricId];
    } else {
      newSelectedMetrics = [...selectedMetrics, metricId];
      try {
        const indicators = await getIndicatorsForMetric(metricId);
        newSelectedIndicators[metricId] = indicators.map(indicator => indicator.indicator_id);
      } catch (error) {
        console.log(error);
      }
    }
  
    setSelectedMetrics(newSelectedMetrics);
    setSelectedIndicators(newSelectedIndicators);
  
    const fetchIndicators = async () => {
      const newAllIndicators = {};
      for (const id of newSelectedMetrics) {
        try {
          const indicators = await getIndicatorsForMetric(id);
          newAllIndicators[id] = indicators;
        } catch (error) {
          console.log(error);
        }
      }
      setAllIndicators(newAllIndicators);
    };
    fetchIndicators();
  };

  const handleIndicatorChange = (event, metricId) => {
    console.log('here');
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
    console.log(selectedIndicators);
  }, [selectedIndicators]);

  useEffect(() => {
    console.log(allIndicators);
  }, [allIndicators]);

  const findIndicatorValue = (indicatorName) => {
    if (indicatorName in indicatorsCompany[Number(selectedYear)]) {
      console.log(Number(selectedYear));
      return indicatorsCompany[Number(selectedYear)][indicatorName]['indicator_value'];
    } else {
      return 'N/A';
    }
  }

  return (
    <>
      <Navbar />
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
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <div style={{ width: '30%', display: 'flex', flexDirection: 'column'}}>
          <Card style={{ marginTop: '20px'}}>
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
                      <FormControlLabel key={key} value={key} control={<Radio />} label={framework.framework_name} />
                    ))}
                </RadioGroup>
              </Collapse>
            </FormControl>
          </Card>
          <Card style={{ marginTop: '100px' }}>
            <FormControl style={{ marginLeft: '20px', cursor: 'pointer' }} component="fieldset">
              <FormLabel component="legend" onClick={handleExpandClick1} style={{ display: 'flex', alignItems: 'center' }}>
                Metrics and Indicators
                <IconButton onClick={handleExpandClick1} size="small">
                  {expanded1 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </FormLabel>
              <Collapse in={expanded1}>
                <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '1' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                    <FormGroup>
                      {metricNames &&
                        metricNames.map((metric) => (
                          <div key={metric.id} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <FormControlLabel
                                value={metric.id.toString()}
                                control={<Checkbox checked={selectedMetrics.includes(metric.id)} />}
                                label={metric.name}
                                onChange={handleMetricChange}
                              />
                              <IconButton
                                onClick={() => handleMetricExpandClick(metric.id)}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  color: 'rgba(0, 0, 0, 0.54)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                size="small"
                              >
                                {expandedMetrics[metric.id] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                              </IconButton>
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
                  </div>
                </div>

                {/* Button - Only visible when section is expanded */}
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

        <div style={{ width: '60%', marginTop: '20px', marginLeft: '10px'}}>
          <Card>
            <IconButton onClick={() => setTableCollapsed(!tableCollapsed)}>
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
                <Grid item xs={6}>
                  <TableContainer component={Paper} style={{ marginLeft: '50px', border: '1px solid #ddd' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ borderRight: '1px solid #ddd', width: '30%' }}>Metric</TableCell>
                          <TableCell style={{ borderRight: '1px solid #ddd', width: '30%' }}>Indicator</TableCell>
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
                                    {indicator ? indicator.indicator_name : 'Unknown Indicator'}
                                  </TableCell>
                                  <TableCell style={{ borderBottom: '1px solid #ddd' }}>
                                    {indicator ? findIndicatorValue(indicator.indicator_name) : 'N/A'}                                  
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
                // <IndicatorsInfo companyName={companyName}/>
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
                                <TableCell>{indicator.indicator_value}</TableCell>
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
    </>
  );
};

export default Company;
