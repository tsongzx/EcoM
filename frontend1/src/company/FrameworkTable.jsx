import React, { useEffect, useState } from 'react';
import {
  Button,
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
  TableBody,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getPrediction } from '../helper';

const FrameworkTable = ({indicatorsCompany, selectedYear, setSelectedYear, 
  companyName, availableYears, selectedFramework, selectedIndicators, metricNames, allIndicators,
  metricScores, allIndicatorsInfo
}) => {
  const [tableCollapsed, setTableCollapsed] = useState(true);
  const [predictedScore, setPredictedScore] = useState({});
  const [indicatorsInSelectedFramework, setIndicatorsInSelectedFramework] = useState({});

  useEffect(() => {
    const selectedIds = Object.values(selectedIndicators).flat();
    const filteredPredictedScore = Object.fromEntries(
      Object.entries(predictedScore)
        .filter(([_, value]) => selectedIds.includes(value.id))
    );
    console.log(filteredPredictedScore);
    setIndicatorsInSelectedFramework(filteredPredictedScore);
  }, [selectedIndicators]);

  useEffect(() => {
    console.log(indicatorsInSelectedFramework);
  }, [indicatorsInSelectedFramework]);

  useEffect(() => {
    console.log(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    console.log(availableYears);
  }, [availableYears]);

  useEffect(() => {
    console.log(selectedIndicators);
  }, [selectedIndicators]);

  useEffect(() => {
    console.log(selectedFramework);
  }, [selectedFramework]);

  useEffect(() => {
    console.log(allIndicatorsInfo);
  }, [allIndicatorsInfo]);

  console.log(metricScores);

  const findIndicatorValue = (indicatorName) => {
    if (indicatorName in indicatorsCompany[Number(selectedYear)]) {
      return indicatorsCompany[Number(selectedYear)][indicatorName]['indicator_value'];
    } else {
      return ' ';
    }
  }
  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (year === 'Predicted') {
      console.log('here');
      aiPredict();
    }
  };

  const aiPredict = async () => {
    let allPredictedScores = {};
    for (const indicator of Object.values(allIndicatorsInfo)) {
      let score = await getPrediction(indicator.name, indicator.unit, companyName);
      if (score) {
        let newObj = {};
        newObj['id'] = indicator.id; 
        newObj['indicator_name'] = score.indicator_name;
        newObj['prediction'] = score.prediction;
        allPredictedScores[score.indicator_id] = newObj;
      }
    }
    console.log(allPredictedScores);
    setPredictedScore(allPredictedScores);
  }

  useEffect(() => {
    console.log(predictedScore);
  }, [predictedScore]);

  const getName = (name) => {
    if (name === 'Yes/No') {
      return '1/0';
    } else {
      return name;
    }
  }

  return (
    <Card style={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
      <IconButton onClick={() => setTableCollapsed(!tableCollapsed)} size="large">
        See table
        {tableCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </IconButton>
      <Collapse in={!tableCollapsed}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <h2>{companyName}</h2>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '30px'}}>
            {availableYears.map((year) => (
              // <Button key={year} onClick={() => handleYearChange(year)}>
              //   {year}
              // </Button>
              <Button
                key={year}
                onClick={() => handleYearChange(year)}
                sx={{
                  borderRadius: 1,
                  boxShadow: (theme) => 
                    selectedYear === year 
                      ? `0px 8px 16px ${theme.palette.grey[700]}` // 3D effect for selected button
                      : `0px 4px 8px ${theme.palette.grey[500]}`, // 2D effect for unselected buttons
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  backgroundColor: (theme) => selectedYear === year ? '#6D28D9' : '#B4B2FC', // Dark purple for selected, light purple for others
                  color: (theme) => selectedYear === year ? theme.palette.primary.contrastText : 'black',
                  margin: '0 8px', // Space between buttons
                  transform: selectedYear === year ? 'translateY(-4px)' : 'translateY(0)', // Elevate selected button
                  '&:hover': {
                    boxShadow: (theme) => 
                      selectedYear === year 
                        ? `0px 10px 20px ${theme.palette.grey[700]}` // Darker shadow for selected on hover
                        : `0px 6px 12px ${theme.palette.grey[600]}`, // Slightly darker shadow for unselected on hover
                    transform: 'translateY(-2px)',
                    backgroundColor: (theme) => selectedYear === year ? '#6D28D9' : '#A6A6FF', // Slightly different color on hover
                  },
                }}
              >
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
                    {selectedYear !== 'Predicted' && (
                      <>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>Metric</TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>Score</TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator Name</TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator Unit</TableCell>
                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>Value</TableCell>
                      </>
                    )}
                    {selectedYear === 'Predicted' && (
                      <>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator Name</TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator Unit</TableCell>
                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>Predicted Value</TableCell>
                      </>
                    )}

                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedYear !== 'Predicted' && (
                    <>
                      {Object.entries(selectedIndicators).map(([metricId, indicatorIds]) => {
                        const metricName = metricNames.find(m => m.id === Number(metricId))?.name || 'Unknown Metric';
                        const score = metricScores[metricId]?.score ?? '';
                        const indicators = allIndicators[metricId] || [];
                        console.log(indicators);
                        return (
                          indicatorIds.map((indicatorId, index) => {
                            const indicator = indicators.find(ind => ind.indicator_id === indicatorId);
                            return (
                              <TableRow key={`${metricId}-${indicatorId}`}>
                                {index === 0 && (
                                  <>
                                    <TableCell
                                      rowSpan={indicatorIds.length}
                                      style={{ borderRight: '1px solid #ddd' }}
                                    >
                                      {metricName}
                                    </TableCell>
                                    <TableCell
                                      rowSpan={indicatorIds.length}
                                      style={{ borderRight: '1px solid #ddd' }}
                                    >
                                      {score}
                                    </TableCell>
                                  </>
                                )}
                                <TableCell style={{ borderRight: '1px solid #ddd' }}>
                                  {indicator ? indicator.indicator_name : ' '}
                                </TableCell>
                                <TableCell style={{ borderRight: '1px solid #ddd' }}>
                                  {indicator ? getName(Object.values(allIndicatorsInfo).find(item => item.id === indicator.indicator_id).unit) : ' '}
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
                    </>
                  )}
                  {selectedYear === 'Predicted' && (
                    <>
                      {(Object.keys(predictedScore).length > 0) && Object.values(predictedScore).map((indicator, index) => (
                        <TableRow key={index}>
                          <TableCell style={{ borderRight: '1px solid #ddd' }}>{indicator.indicator_name}</TableCell>
                          <TableCell style={{ borderRight: '1px solid #ddd' }}>{getName(Object.values(allIndicatorsInfo).find(item => item.id === indicator.id).unit)}</TableCell>
                          <TableCell align="right">{indicator.prediction}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
        {!selectedFramework && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            {selectedYear && indicatorsCompany[selectedYear] && selectedYear !== 'Predicted' && (
              <TableContainer component={Paper} style={{ marginTop: '40px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator Name</TableCell>
                      <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator Unit</TableCell>
                      <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedYear !== 'Predicted') && Object.values(indicatorsCompany[selectedYear]).map((indicator, index) => (
                      
                      <TableRow key={index}>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>{indicator.indicator_name}</TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>{getName(Object.values(allIndicatorsInfo).find(item => item.name === indicator.indicator_name).unit)}</TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }} align="right">{indicator.indicator_value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {selectedYear === 'Predicted' && (
              <TableContainer component={Paper} style={{ marginTop: '40px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator Name</TableCell>
                      <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator Unit</TableCell>
                      <TableCell style={{ borderRight: '1px solid #ddd' }}>Predicted Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Object.keys(predictedScore).length > 0) && Object.values(predictedScore).map((indicator, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>{indicator.indicator_name}</TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>{getName(Object.values(allIndicatorsInfo).find(item => item.id === indicator.id).unit)}</TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }} align="right">{indicator.prediction}</TableCell>
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
  );
}

export default FrameworkTable;