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

const FrameworkTable = ({indicatorsCompany, selectedYear, setSelectedYear, 
  companyName, availableYears, selectedFramework, selectedIndicators, metricNames, allIndicators,
  metricScores
}) => {
  const [tableCollapsed, setTableCollapsed] = useState(true);
  {console.log('Selected Framework:', selectedFramework)};

  useEffect(() => {
    console.log(selectedFramework);
  }, [selectedFramework]);

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
  };
  return (
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
        {/* {selectedFramework && (
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
        )} */}
        {selectedFramework && (
          <Grid container justifyContent="center">
            <TableContainer component={Paper} style={{ border: '1px solid #ddd', width: '90%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>Metric</TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>Score</TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>Indicator</TableCell>
                    <TableCell style={{ borderBottom: '1px solid #ddd' }}>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(selectedIndicators).map(([metricId, indicatorIds]) => {
                    const metricName = metricNames.find(m => m.id === Number(metricId))?.name || 'Unknown Metric';
                    const score = metricScores[metricId]?.score ?? '';
                    const indicators = allIndicators[metricId] || [];
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
  );
}

export default FrameworkTable;