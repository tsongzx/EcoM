import React from "react";
import {
  Grid,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

const SampleTable = ({ indicatorsCompany, selectedYear, selectedFramework, selectedIndicators, metricNames, allIndicators,
  metricScores, allIndicatorsInfo, predictedScore }) => {

  const getName = (name) => {
    if (name === 'Yes/No') {
      return '1/0';
    } else {
      return name;
    }
  }

  const findIndicatorValue = (indicatorName) => {
    if (indicatorName in indicatorsCompany[Number(selectedYear)]) {
      return indicatorsCompany[Number(selectedYear)][indicatorName]['indicator_value'];
    } else {
      return ' ';
    }
  }

  return (
    <div>
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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
    </div>
  );
}

export default SampleTable;