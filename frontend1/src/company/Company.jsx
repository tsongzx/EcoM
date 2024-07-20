import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  getIndicatorsForMetric
} from '../helper.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Company = () => {
  const location = useLocation();
  const { companyId, companyName } = location.state || {};
  const stateCompanyName = location.state?.companyName;
  const displayCompanyName = companyName || stateCompanyName;
  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [isInFavs, setIsInFavs] = useState(false);
  const [officialFrameworks, setOfficialFrameworks] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [metricNames, setMetricNames] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [metricIndicators, setMetricIndicators] = useState({});
  const [selectedIndicators, setSelectedIndicators] = useState({});  // Updated to an object
  const token = Cookies.get('authToken');

  useEffect(async () => {
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedFramework) {
        const metrics = await getMetricForFramework(true, selectedFramework);
        console.log(metrics);
        if (metrics) {
          const nameOfMetrics = [];
          for (const item of Object.values(metrics)) {
            const name = await getMetricName(item.metric_id);
            nameOfMetrics.push({ id: item.metric_id, name: name });
          }
          setMetricNames(nameOfMetrics);
        }
      }
    };
    fetchData();
  }, [selectedFramework]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClick1 = () => {
    setExpanded1(!expanded1);
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
      return;
    }
  };

  const handleReturn = () => {
    window.history.back();
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
    const companyId_int = Number(companyId.split(' ')[1]);

    if (isInFavs) {
      addToFavourites(companyId_int);
    } else {
      deleteFromFavourites(companyId_int);
    }
  };

  const handleFrameworkChange = (event) => {
    setSelectedFramework(Number(event.target.value) + 1);
  };

  const handleMetricChange = async (event) => {
    const metricId = Number(event.target.value);
    let newSelectedMetrics = [];
    if (selectedMetrics.includes(metricId)) {
      newSelectedMetrics = selectedMetrics.filter((id) => id !== metricId);
    } else {
      newSelectedMetrics = [...selectedMetrics, metricId];
    }
    setSelectedMetrics(newSelectedMetrics);

    // Fetch indicators for all selected metrics
    const newMetricIndicators = { ...metricIndicators };
    for (const id of newSelectedMetrics) {
      if (!newMetricIndicators[id]) {
        try {
          const indicators = await getIndicatorsForMetric(id);
          console.log(indicators);
          newMetricIndicators[id] = indicators;
        } catch (error) {
          console.log(error);
        }
      }
    }
    setMetricIndicators(newMetricIndicators);
  };
  const handleIndicatorChange = (event, metricId) => {
    const indicatorId = Number(event.target.value);
    
    setSelectedIndicators((prevSelectedIndicators) => {
      // Get the current indicators for the metric or initialize an empty array
      const metricIndicators = prevSelectedIndicators[metricId] || [];
      const isSelected = metricIndicators.includes(indicatorId);
      
      // Update the indicators for the metric
      const updatedIndicators = isSelected
        ? metricIndicators.filter((id) => id !== indicatorId)
        : [...metricIndicators, indicatorId];
      
      // Create a new state object, excluding entries with empty arrays
      const newIndicators = {
        ...prevSelectedIndicators,
        [metricId]: updatedIndicators.length > 0 ? updatedIndicators : undefined,
      };
      
      // Remove the metricId entry if the array is empty
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
    console.log(metricNames);
  }, [metricNames]);

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
            <h3>NASDAQ, inc. ETF - What is this for?</h3>
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
      <Card>
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
          <FormLabel component="legend" onClick={handleExpandClick1}>
            Metrics and Indicators
            <IconButton onClick={handleExpandClick1} size="small">
              {expanded1 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </FormLabel>
          <Collapse in={expanded1}>
            <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '1' }}>
              <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '1' }}>
                <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '1' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                    <FormGroup style={{ border: '1px solid red' }}>
                      {metricNames &&
                        metricNames.map((metric) => (
                          <div key={metric.id}>
                            <FormControlLabel
                              value={metric.id.toString()}
                              control={<Checkbox />}
                              label={metric.name}
                              onChange={handleMetricChange}
                            />
                            {selectedMetrics.includes(metric.id) &&
                              metricIndicators[metric.id] &&
                              metricIndicators[metric.id].length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                                  <FormGroup
                                    style={{ marginLeft: '30px' }}
                                    name="indicators"
                                    value={selectedIndicators[metric.id] || []}
                                  >
                                    {metricIndicators[metric.id].map((indicator) => (
                                      <FormControlLabel
                                        key={indicator.indicator_id}
                                        value={indicator.indicator_id.toString()}
                                        control={<Checkbox />}
                                        label={indicator.indicator_name}
                                        onChange={(event) => handleIndicatorChange(event, metric.id)}
                                      />
                                    ))}
                                  </FormGroup>
                                </div>
                              )}
                          </div>
                        ))}
                    </FormGroup>
                  </div>
                </div>
              </div>

              <Grid item xs={6} style={{ border: '1px solid red' }}>
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>Metric</TableCell>
                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metricNames &&
                        Object.values(metricNames).map((metric) => (
                          <TableRow key={metric.id}>
                            <TableCell style={{ borderRight: '1px solid #ddd' }}>{metric.name}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ddd' }}></TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </div>
          </Collapse>
        </FormControl>
      </Card>
      <CompareModal companyName={displayCompanyName} isOpen={compareModalOpen} compareModalOpen={compareModalOpen} setCompareModalOpen={setCompareModalOpen} />
    </>
  );
};

export default Company;
