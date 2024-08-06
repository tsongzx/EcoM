import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle, DialogContent, FormControl, FormLabel,
  FormGroup, FormControlLabel, Checkbox, IconButton, Typography, Collapse, Card, Slider, TextField,
  Modal, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getMetricScoreByYear, putFrameworkModifyMetrics } from '../helper';

// This component displays everything associated to the category, metric and indicator weightings, as well as the
// modals associated if the user chooses to change them. 
const MetricIndicatorsCard = ({selectedIndicators, selectedMetrics, metricNames, setSelectedIndicators, setSelectedMetrics,
  allIndicators, allIndicatorsInfo, setMetricNames, setAllIndicators,
  sliderValues, sliderValuesFixed, sliderValuesIndicatorFixed, metricNamesFixed,
  selectedMetricsFixed, allIndicatorsFixed, selectedIndicatorsFixed, sliderValuesIndicator,
  setSliderValuesIndicator, setSliderValues, eScore, sScore, gScore, frameworkScore, setFrameworkScore,
  indicatorsCompany, selectedYear, setMetricScores, seteScore, setgScore, setsScore, findCategoricalMetrics, officialFrameworks,
  selectedFramework
}) => {
  const [lockedSliders, setLockedSliders] = useState({});
  const [lockedSlidersIndicators, setLockedSlidersIndicators] = useState({}); 
  const [triggerSource, setTriggerSource] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState({});
  const [expanded1, setExpanded1] = useState(false);

  const [errorE, setErrorE] = useState('');
  const [errorS, setErrorS] = useState('');
  const [errorG, setErrorG] = useState('');

  // Users can choose to lock a metric
  const [isLockedE, setIsLockedE] = useState(false);
  const [isLockedS, setIsLockedS] = useState(false);
  const [isLockedG, setIsLockedG] = useState(false);

  const [errorMetrics, setErrorMetrics] = useState({});
  const [errorPillarModal, setErrorPillarModal] = useState('');

  const [pillarWeighting, setPillarWeighting] = useState({'E': 0, 'S': 0, 'G': 0});

  const [modalE, setModalE] = useState(pillarWeighting['E']);
  const [modalS, setModalS] = useState(pillarWeighting['S']);
  const [modalG, setModalG] = useState(pillarWeighting['G']);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalWeightingOpen, setModalWeightingOpen] = useState(false);
  const [modalWeightingError, setModalWeightingError] = useState('');

  // Sets the categorical weighting as displayed on the modal
  useEffect(() => { 
    setModalE(pillarWeighting['E']);
    setModalS(pillarWeighting['S']);
    setModalG(pillarWeighting['G']);
  }, [pillarWeighting]);

  useEffect(() => {
    if (selectedFramework) {
      let newObj = {};
      const foundFramework = officialFrameworks.find(obj => obj.id === selectedFramework) || { E: 0, S: 0, G: 0 };

      newObj['E'] = foundFramework.E || 0;
      newObj['S'] = foundFramework.S || 0;
      newObj['G'] = foundFramework.G || 0;
      setPillarWeighting(newObj);
    }
  }, [selectedFramework, officialFrameworks]);

  // Finds the overall framework score and sets it
  useEffect(() => {
    const frameworkScore = eScore * pillarWeighting['E'] + sScore * pillarWeighting['S'] + gScore * pillarWeighting['G'];
    setFrameworkScore(frameworkScore);
  }, [eScore, sScore, gScore]);

  // The next 2 functions deals with any instances the user changes the indicator weightings
  // and/or metric weightings. This includes if the user wants to reset back to default
  useEffect(() => {
    let newLockedSlidersIndicators = {};
    let newSliderValuesIndicators = {};

    const keys = Object.keys(lockedSlidersIndicators).map(key => Number(key.split('-')[1]));

    for (let key of keys) {
      for (let [selectedKey, arr] of Object.entries(selectedIndicators)) {
        if (arr.includes(key)) {
          newLockedSlidersIndicators[`${selectedKey}-${key}`] = lockedSlidersIndicators[`${selectedKey}-${key}`];
          break; 
        }
      }
    }
    
    // Sets all the indicators that the user has locked (i.e finalised so its weightings won't change)
    setLockedSlidersIndicators(newLockedSlidersIndicators);

    Object.entries(selectedIndicators).forEach(([key, arr]) => {
      let unlockedWeighting = 0;
      let lockedWeighting = 0;

      // Finds the total sum of indicators that aren't locked
      arr.forEach(value => {
        if (!lockedSlidersIndicators.hasOwnProperty(`${key}-${value}`) && sliderValuesIndicator[`${key}-${value}`]) {
          unlockedWeighting += sliderValuesIndicator[`${key}-${value}`];
        } else if (lockedSlidersIndicators.hasOwnProperty(`${key}-${value}`)) {
          lockedWeighting += sliderValuesIndicator[`${key}-${value}`];
          unlockedWeighting += sliderValuesIndicator[`${key}-${value}`];
        }
      });

      arr.forEach(value => {
          if (!lockedSlidersIndicators.hasOwnProperty(`${key}-${value}`) && sliderValuesIndicator.hasOwnProperty(`${key}-${value}`)) {
          newSliderValuesIndicators[`${key}-${value}`] = (1 - lockedWeighting) * sliderValuesIndicator[`${key}-${value}`] / (unlockedWeighting - lockedWeighting);
        } else if (!lockedSlidersIndicators.hasOwnProperty(`${key}-${value}`) && !sliderValuesIndicator.hasOwnProperty(`${key}-${value}`)) {
          newSliderValuesIndicators[`${key}-${value}`] = 0;
        } else {
          newSliderValuesIndicators[`${key}-${value}`] = sliderValuesIndicator[`${key}-${value}`];
        }
      })
      unlockedWeighting = 0;
      lockedWeighting = 0;
    });

    setSliderValuesIndicator(newSliderValuesIndicators);

    let newArray = selectedMetrics.filter(value => selectedIndicators.hasOwnProperty(value));
    setSelectedMetrics(newArray);

    // This implies the user wants to reset back to default
    if (triggerSource === true) {
      setSliderValuesIndicator(sliderValuesIndicatorFixed);
      setTriggerSource(false);
    } 
    
  }, [selectedIndicators, triggerSource]);

  useEffect(() => {
    let newLockedSliders = {};
    let newSliderValues = {};

    // 1. Update Locked sliders
    const keys = Object.keys(lockedSliders).map(key => Number(key));

    for (let key of keys) {
      if (selectedMetrics.includes(key)) {
        newLockedSliders[key] = lockedSliders[key];
      }
    }

    setLockedSliders(newLockedSliders);

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

      if (lockedSliders.hasOwnProperty(entry) && sliderValues.hasOwnProperty(entry)) {
        if (category === 'E') {
          lockedE += sliderValues[entry];
        } else if (category === 'S') {
          lockedS += sliderValues[entry];
        } else {
          lockedG += sliderValues[entry];
        }
      }
    }

    // The weighting of each metric of a specific category has been set according to its
    // relative ratio to everything else
    for (let entry of selectedMetrics) {
      let category = metricNames.find(metric => metric.id === entry).category;

      if (!lockedSliders.hasOwnProperty(entry) && sliderValues.hasOwnProperty(entry)) {
        if (category === 'E') {
          newSliderValues[entry] = isNaN((1- lockedE) * sliderValues[entry] / (totalE - lockedE)) ? 0 : (1- lockedE) * sliderValues[entry] / (totalE - lockedE);
        } else if (category === 'S') {
          newSliderValues[entry] = isNaN((1- lockedS) * sliderValues[entry] / (totalS - lockedS)) ? 0 : (1- lockedS) * sliderValues[entry] / (totalS - lockedS);
        } else {
          newSliderValues[entry] = isNaN((1- lockedG) * sliderValues[entry] / (totalG - lockedG)) ? 0 : (1- lockedG) * sliderValues[entry] / (totalG - lockedG);
        }
      } else if (!lockedSliders.hasOwnProperty(entry) && !sliderValues.hasOwnProperty(entry)) {
        newSliderValues[entry] = 0;
      } else {
        // Locked metric weightings don't change
        newSliderValues[entry] = sliderValues[entry];
      }

    }

    setSliderValues(newSliderValues);
    
    // Resets everything 
    if (triggerSource === true) {
      setSelectedIndicators(selectedIndicatorsFixed);
      setSliderValues(sliderValuesFixed);
      
    } 

  }, [selectedMetrics, triggerSource]);

  // This function deals with the occurrence that the user has 
  // changed the existing set of metrics
  const handleMetricChange = (event) => {
    const metricId = Number(event.target.value);
  
    let newSelectedIndicators = { ...selectedIndicators };
    let newSelectedMetrics = [...selectedMetrics];
    
    if (selectedMetrics.includes(metricId)) {
      newSelectedMetrics = selectedMetrics.filter((id) => id !== metricId);
      // User has unselected a metric
      delete newSelectedIndicators[metricId];
    } else {
      newSelectedMetrics = [...selectedMetrics, metricId];
      // User added a new metric
      newSelectedIndicators[metricId] = allIndicators[metricId].map(indicator => indicator.indicator_id);
    }
    setSelectedMetrics(newSelectedMetrics);
    setSelectedIndicators(newSelectedIndicators);
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

  // This checks that the weights of the pillars the user has set adds up to 1
  const checkPillarWeighting = () => {
    const decimalRegex = /^[0-9]+(\.[0-9]+)?$/;

    // Need to make sure it is a decimal
    if ((!decimalRegex.test(modalE) || !decimalRegex.test(modalS) || !decimalRegex.test(modalG))) {
      setErrorPillarModal('Please ensure all fields contain a value from 0 to 1.')
    } else if (isNaN(parseFloat(modalE)) || isNaN(parseFloat(modalS)) || isNaN(parseFloat(modalG))) {
      setErrorPillarModal('Please ensure all fields contain a value from 0 to 1.')
    } else {
      let cumSum = parseFloat(modalE) + parseFloat(modalS) + parseFloat(modalG);
      // Decimal sum has to be near close to one
      if (cumSum <= 0.999999 || cumSum >= 1.000001) {
        setErrorPillarModal('Please ensure that all weightings add up to 1.');
      } else {
        let newPillarWeighting = {};
        newPillarWeighting['E'] = modalE;
        newPillarWeighting['S'] = modalS;
        newPillarWeighting['G'] = modalG;

        // Sets the new weighting since they are valid
        setPillarWeighting(newPillarWeighting);
        setModalOpen(false);
        setErrorPillarModal('');
      }
    }
  }

  // This function loads the description of the indicator that is observed
  // on hover
  const loadIndicatorInfo = (indicatorId) => {
    const description = allIndicatorsInfo[indicatorId].description;
    return description;
  }

  // This function sets the selected metric back to default -> I.e the states
  // upon initial load
  const resetToDefault = () => {
    setLockedSliders({});
    setLockedSlidersIndicators({});
    setTriggerSource(true);
    setMetricNames(metricNamesFixed);
    setSelectedMetrics(selectedMetricsFixed);
    setAllIndicators(allIndicatorsFixed);
    setSelectedIndicators(selectedIndicatorsFixed);
  }

  // This function renders the information of each category
  const renderMetricsByCategory = (category) => {
    // If there are no metrics available, then there is nothing to render
    if (!metricNames) return null;
    
    // All the metrics under this category
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
                  onChange={(event) => handleMetricChange(event)}
                />
                {/*User can choose to expand or collapse*/}
                <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <IconButton onClick={() => handleMetricExpandClick(metric.id)} size="small">
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

              {/*Maps the indicators of a selected metric*/}
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
                          <FormControlLabel key={indicator.indicator_id} value={indicator.indicator_id.toString()}
                            control={<Checkbox checked={selectedIndicators[metric.id]?.includes(indicator.indicator_id) || false}
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
                          {/**Displays information about indicator on hover */}
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
                                  color: lockedSlidersIndicators[`${metric.id}-${indicator.indicator_id}`] ? 'gray' : 'red',
                                },
                                '& .MuiSlider-track': {
                                  color: lockedSlidersIndicators[`${metric.id}-${indicator.indicator_id}`] ? 'gray' : 'red',
                                },
                                '& .MuiSlider-rail': {
                                  color: lockedSlidersIndicators[`${metric.id}-${indicator.indicator_id}`] ? 'gray' : 'red',
                                },
                              }}
                              value={sliderValuesIndicator[`${metric.id}-${indicator.indicator_id}`] || 0}
                              onChange={(event, newValue) => handleSliderChangeIndicators(indicator.indicator_id, newValue, metric.id)}
                              min={0}
                              max={1}
                              step={0.01}
                              valueLabelDisplay="auto"
                              valueLabelFormat={(value) => value.toFixed(6)}
                              disabled={lockedSlidersIndicators[`${metric.id}-${indicator.indicator_id}`]} 
                            />
                            <IconButton onClick={() => handleLockClickIndicator(metric.id, indicator.indicator_id)} size="small">
                              {lockedSlidersIndicators[`${metric.id}-${indicator.indicator_id}`] ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
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

  // This function changes the weighting of the category modals if the user decides to change it
  const handleWeightingChange = (pillar, value) => {
    const decimalRegex = /^[0-9]+(\.[0-9]+)?$/;
    const numericValue = parseFloat(value);
    // Ensures form is valid
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

  // Allows user to exist the modal
  const handleCancel = () => {
    setModalOpen(false);
    setModalE(pillarWeighting['E']);
    setModalS(pillarWeighting['S']);
    setModalG(pillarWeighting['G']);
    setErrorPillarModal('');
  };

  // Checks if each metric and its indicators' weighting adds up to 1
  const checkMetric = (metricId) => {
    let cumSum = 0;
    let errors = {};

    const indicatorsOfConcern = allIndicators[metricId];
    indicatorsOfConcern.forEach(indicator => {
      if (selectedIndicators[metricId].includes(indicator.indicator_id)) {
        cumSum += sliderValuesIndicator[`${metricId}-${indicator.indicator_id}`];
      }
    });

    // Accepted range of scores
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

  // This function deals with changing the weighting of indicators 
  const handleSliderChangeIndicators = (indicatorId, newValue, metricId) => {

    // Get all the other indicators under the same metric
    let indicatorsOfSameMetric = allIndicators[metricId];
    indicatorsOfSameMetric = indicatorsOfSameMetric
    .filter(indicator => indicator.indicator_id !== indicatorId)
    .filter(indicator => !lockedSlidersIndicators.hasOwnProperty(`${metricId}-${indicator.indicator_id}`));
    
    // Get all the locked indicators of the same metrics
    let lockedIndicators = allIndicators[metricId]
      .filter(indicator => indicator.indicator_id !== indicatorId)
      .filter(indicator => lockedSlidersIndicators.hasOwnProperty(`${metricId}-${indicator.indicator_id}`));

    const additional = lockedIndicators.reduce((sum, indicator) => sum + indicator.weighting, 0);
    const remainingWeight = 1 - newValue - additional;
    const totalWeighting = indicatorsOfSameMetric.reduce((total, item) => total + item.weighting, 0);
    
    // Make sure the lowest possible indicator weighting is 0
    if (remainingWeight < 0) {
      indicatorsOfSameMetric.forEach(item => 
        item.weighting = 0
      );
    } else {
      // Makes indicator weighting of relative ratio (similar to metrics)
      indicatorsOfSameMetric.forEach(item => 
        item.weighting = remainingWeight * (item.weighting / totalWeighting)
      );
    }

    // Update the state of the indicators
    setSliderValuesIndicator(prevValues => {
      const updatedValues = {...prevValues};
      indicatorsOfSameMetric.forEach(item => {
        updatedValues[`${metricId}-${item.indicator_id}`] = isNaN(item.weighting) ? 0 : item.weighting;
      });
      updatedValues[`${metricId}-${indicatorId}`] = newValue;
      return updatedValues;
    });

  }
  
  const getClampedValue = (value, max) => {
    return Math.min(value, max);
  }

  // This function checks all the weightings of the metrics of a category adds up to 1
  const checkPillar = (category) => {
    const allMetrics = metricNames
    .filter(metric => metric.category === category)
    .filter(metric => selectedMetrics.includes(metric.id));

    // No categorical metrics chosen
    if (allMetrics.length === 0) {
      return;
    }

    let cumWeighting = 0;
    allMetrics.forEach(metric => 
      cumWeighting += sliderValues[metric.id]
    );

    // Accepted range of values
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

  // Upon initial rendering, this finds the largest weight a metric could possibly take
  const findMaxWeight = (metricId) => {
    const categoryOfInterest = metricNames.find(metric => metric.id === metricId)['category'];
    const lockedMetrics = metricNames
      .filter(metric => metric.category === categoryOfInterest)
      .filter(metric => !selectedMetrics.includes(metric.id))
      .filter(metric => lockedSliders.hasOwnProperty(metric.id));
    
    if (lockedMetrics.length === 0) {
      return 1;
    } else {
      const totalWeighting = lockedMetrics.reduce((sum, metric) => sum + metric.weighting, 0);
      return 1 - totalWeighting;
    }
  }

  // This function deals with the event that an indicator has been locked
  const handleLockClickIndicator = (metricId, indicatorId) => {
    setLockedSlidersIndicators((prevLockedSlidersIndicators) => {
      const newLockedSlidersIndicators = {...prevLockedSlidersIndicators};
      if (newLockedSlidersIndicators[`${metricId}-${indicatorId}`]) {
        delete newLockedSlidersIndicators[`${metricId}-${indicatorId}`];
      } else {
        newLockedSlidersIndicators[`${metricId}-${indicatorId}`] = true;
      }
      return newLockedSlidersIndicators;
    });
  }

  // This indicator sets the event that a metric has been locked
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

  // This function is the metric version of weighting changes
  const handleSliderChange = (metricId, newValue) => {
    const changedMetric = metricNames.find(metric => metric.id === metricId);
    changedMetric.weighting = newValue;
    const category = changedMetric.category;
    const filteredMetrics = metricNames
      .filter(metric => metric.category === category)
      .filter(metric => metric.id !== metricId)
      .filter(metric => selectedMetrics.includes(metric.id))
      .filter(metric => !lockedSliders.hasOwnProperty(metric.id));
      
    const lockedMetrics = metricNames
      .filter(metric => metric.category === category)
      .filter(metric => metric.id !== metricId)
      .filter(metric => selectedMetrics.includes(metric.id))
      .filter(metric => lockedSliders.hasOwnProperty(metric.id));
    
    let additional = 0;
    lockedMetrics.forEach(metric => {
      additional += sliderValues[metric.id];
    });

    const remainingWeight = 1 - newValue - additional;
    let totalWeighting = 0;
    filteredMetrics.forEach(metric => {
      totalWeighting += sliderValues[metric.id];
    })
    
    if (remainingWeight < 0) {
      filteredMetrics.forEach(item =>
        item.weighting = 0
      );
    } else {
      filteredMetrics.forEach(item => {
          item.weighting = isNaN(remainingWeight * (sliderValues[item.id] / totalWeighting)) ? 0 : remainingWeight * (sliderValues[item.id] / totalWeighting)
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

  // This function checks that the sum of all categories add up to 1
  const checkAll = () => {
    const pillarAddsUp = pillarWeighting['E'] + pillarWeighting['S'] + pillarWeighting['G'];
    if ((pillarAddsUp < 0.99999) || (pillarAddsUp >= 1.000001)) {
      setModalWeightingOpen(true);
      setModalWeightingError('Please ensure your metric weightings add up to 1.');
      return;
    } 
    
    let eWeighting = 0;
    let sWeighting = 0;
    let gWeighting = 0;

    let eLength = 0;
    let sLength = 0;
    let gLength = 0;

    for (const key in sliderValues) {
      let category = metricNames.find(indicator => indicator.id === parseInt(key)).category;
      let weighting = sliderValues[parseInt(key)];
      if (category === 'E') {
        eLength += 1;
        eWeighting += weighting;
      } else if (category === 'S') {
          sLength += 1;
          sWeighting += weighting;
      } else if (category === 'G') {
          gLength += 1;
          gWeighting += weighting;
      }    
    }

    const eOK = ((eWeighting >= 0.99999 && eWeighting <= 1.00001 && eLength > 0) || (eLength === 0));
    const sOK = ((sWeighting >= 0.99999 && sWeighting <= 1.00001 && sLength > 0) || (sLength === 0));
    const gOK = ((gWeighting >= 0.99999 && gWeighting <= 1.00001 && gLength > 0) || (gLength === 0));

    // One of the metrics is not OK -> Immediately exit
    if (!eOK) {
      setModalWeightingOpen(true);
      setModalWeightingError('Please ensure your environmental metric weightings add up to 1.');
      return;
    } else if (!sOK) {
      setModalWeightingOpen(true);
      setModalWeightingError('Please ensure your social metric weightings add up to 1.');
      return;
    } else if (!gOK) {
      setModalWeightingOpen(true);
      setModalWeightingError('Please ensure your governance metric weightings add up to 1.');
      return;
    }

    for (const key in selectedIndicators) {
      let indicatorWeighting = 0;
      selectedIndicators[key].forEach(element => indicatorWeighting += sliderValuesIndicator[`${key}-${element}`]);
      if ((indicatorWeighting <= 0.99999) || (indicatorWeighting > 1.00001)) {
        // One of the indicators is not OK
        let metricNameInvolved = metricNames.find(item => item.id === parseInt(key)).name;
        setModalWeightingOpen(true);
        setModalWeightingError(`Please ensure your selected indicators for ${metricNameInvolved} add up to 1.`);  
        return;
      }
    }
    putModifiedMetrics();
    getAdjustedFrameworkScore();
  }

  // This function deals with the event that a user has changed the weightings of 
  // either a metric or an indicator and decides to save these changes for later
  const putModifiedMetrics = async() => {
    let array = [];
    for (let id of selectedMetrics) {
      let newObj = {};
      let category = metricNames.find(indicator => indicator.id === id).category;
      let weighting = sliderValues[id];
      // New weighting will be remembered next time
      newObj["category"] = category;
      newObj["metric_id"] = id;
      newObj["weighting"] = weighting;
      array.push(newObj);
    }
    await putFrameworkModifyMetrics(selectedFramework, array, pillarWeighting);
  }

  // This function deals with the event that a framework score has been adjusted as its
  // metrics and indicator properties have been altered
  const getAdjustedFrameworkScore = async() => {
    let metricScoreMock = {};
    for (let idMetric of selectedMetrics) {
      let indicatorsOfMetric = selectedIndicators[idMetric];
      let newObj = {};
      for (let idIndicator of indicatorsOfMetric) {
        let indicatorObject = allIndicators[idMetric].find(item => item.indicator_id === idIndicator);
        newObj[indicatorObject.indicator_name] = sliderValuesIndicator[`${idMetric}-${idIndicator}`];
      }

      let correspondingScore;
      // There is no such year as 'predicted' - that's only to see the predicted values
      if (selectedYear !== 'Predicted') {
        correspondingScore = await getMetricScoreByYear(indicatorsCompany[selectedYear], newObj);
      } else {
        correspondingScore = 0;
      }
      
      let obj1 = {};
      obj1["score"] = correspondingScore;
      metricScoreMock[idMetric] = obj1;
    }

    // Set the new set of score
    setMetricScores(metricScoreMock);
    const filteredEMetrics = findCategoricalMetrics(metricScoreMock, metricNames, 'E');
    seteScore(filteredEMetrics.reduce((sum, { score, weighting }) => sum + (score * weighting), 0));

    const filteredSMetrics = findCategoricalMetrics(metricScoreMock, metricNames, 'S');
    setsScore(filteredSMetrics.reduce((sum, { score, weighting }) => sum + (score * weighting), 0));

    const filteredGMetrics = findCategoricalMetrics(metricScoreMock, metricNames, 'G');
    setgScore(filteredGMetrics.reduce((sum, { score, weighting }) => sum + (score * weighting), 0));

  }

  const handleCloseCheckModal = () => {
    setModalWeightingOpen(false);
    setModalWeightingError('');
  }

  // This function deals with the event that an indicator has been added or removed
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

  return (
    <Card style={{ marginTop: '2vh' }}>
      <FormControl style={{ marginLeft: '1.5vw', display: 'flex', flexDirection: 'column', flex: '1' }} component="fieldset">
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '0'}}>
                  <h3 style={{ fontSize: '25px', fontFamily: 'Roboto', margin: '0', lineHeight: '1.2' }}>Environmental</h3>
                  {eScore !== null && (
                    <h6 style={{ fontSize: '25px', fontFamily: 'Roboto', margin: '0', lineHeight: '1.2' }}>{`Score: ${eScore}`}</h6>
                  )}
                </div>
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '20px'}}>
                  <h3 style={{ fontSize: '25px', fontFamily: 'Roboto', margin: '0', lineHeight: '1.2' }}>Social</h3>
                  {sScore !== null && (
                    <h6 style={{ fontSize: '25px', fontFamily: 'Roboto', margin: '0', lineHeight: '1.2' }}>{`Score: ${sScore}`}</h6>
                  )}
                </div>
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '20px'}}>
                  <h3 style={{ fontSize: '25px', fontFamily: 'Roboto', margin: '0', lineHeight: '1.2' }}>Governance</h3>
                  {gScore !== null && (
                    <h6 style={{ fontSize: '25px', fontFamily: 'Roboto', margin: '0', lineHeight: '1.2' }}>{`Score: ${gScore}`}</h6>
                  )}
                </div>
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
            {frameworkScore !== null && (
              <h6 style={{ fontSize: '25px', fontFamily: 'Roboto' }}>{`Overall Framework Score: ${isNaN(frameworkScore) ? '' : frameworkScore}`}</h6>
            )}
          </div>

          {/**Displays the scores */}
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
                    pattern: /^[0-9]+(\.[0-9]+)?$/, 
                    min: 0,                      
                    max: 1,          
                    step: 0.01,             
                    inputMode: 'decimal'          
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
                    pattern: /^[0-9]+(\.[0-9]+)?$/,  
                    min: 0,                      
                    max: 1,                
                    step: 0.01,             
                    inputMode: 'decimal'      
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
                    pattern: /^[0-9]+(\.[0-9]+)?$/, 
                    min: 0,                    
                    max: 1,              
                    step: 0.01,               
                    inputMode: 'decimal'       
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
            <div style={{ margin: '100px 10px 40px 10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" onClick={() => checkAll()}>
                Save Framework
              </Button>
              <Button variant="contained" color="primary" onClick={resetToDefault}>
                Reset to Default
              </Button>
            </div>
          )}
          <Modal
            open={modalWeightingOpen}
            onClose={() => setModalWeightingOpen(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-title" variant="h6" component="h2">
                {modalWeightingError}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleCloseCheckModal()}>
                Close
              </Button>
            </Box>
          </Modal>
        </Collapse>
      </FormControl>
    </Card>
  );
}

export default MetricIndicatorsCard;