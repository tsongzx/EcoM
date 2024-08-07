import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import { getIndustryAverages, getIndustryInfo, getIndicatorsInfoByName } from '../helper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import NumericLabel from 'react-pretty-numbers';

const IndustryOverview = ({selectedIndustry}) => {

  const [description, setDescription] = useState('');
  const [indicatorAverages, setIndicatorAverages] = useState({});
  const [indicatorInfo, setIndicatorInfo] = useState({});

  const roundValue = (value) => {
    let formattedScore;
    if (value.countDecimals() > 3) {
      formattedScore = value.toExponential(3); 
    } else {
      formattedScore = value.toPrecision(3); 
    }
    return formattedScore
  }

  useEffect(() => {
    const fetchData = async () => {
      const industryInfo = await getIndustryInfo(selectedIndustry);
      setDescription(industryInfo.description);

      const averages = await getIndustryAverages(selectedIndustry);
      
      let info = null;
      if (Object.keys(indicatorInfo || {}).length === 0) {
        info = await getIndicatorsInfoByName();
        console.log(info);
        setIndicatorInfo(info);
      } else {
        info = indicatorInfo;
      }

      for (const indicator in averages) {
        const curValue = averages[indicator]
        if (info[indicator].unit === 'Yes/No') {
          averages[indicator] = Math.round(curValue) === 0 ? 'No' : 'Yes';
        } else {
          // round it 
          // averages[indicator] = roundValue(curValue)
        }
      }
      setIndicatorAverages(averages);
    }
    fetchData();
  }, [selectedIndustry]);

  useEffect(() => {
    const getIndicatorInfo = async() => {
      const info = await getIndicatorsInfoByName();
      console.log(info);
      setIndicatorInfo(info);
    }
    getIndicatorInfo();
  }, []);

  return (
    <Box
      sx={{
        height: 'calc(67vh - 50px)'
      }}
    >
      <Typography variant="h4">Description</Typography>
      <Typography>{description}</Typography>  

      <TableContainer component={Paper}>
        <Table>
          <TableHead
            sx={{
              '& .MuiTableCell-root': {
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: '#7653bd',
              }
            }}
          >
            <TableRow>
              <TableCell>Indicator</TableCell>
              <TableCell align="right">Source</TableCell>
              <TableCell align="right">Pillar</TableCell>
              <TableCell align="right">Unit</TableCell>
              <TableCell align="right">Average</TableCell>
              {/* <TableCell align="right">ESG Score</TableCell> */}
            </TableRow>
          </TableHead>
          {Object.keys(indicatorInfo).length > 0 && <TableBody>
            {Object.keys(indicatorAverages)?.map((indicator, index) => (
              <TableRow key={index}
                // onClick={() => handleRowClick(company.id, company.company_name)} 
                // hover
                // style={{ cursor: 'pointer' }}
              >
                <TableCell>{indicator}</TableCell>
                <TableCell align="right">{indicatorInfo[indicator].source}</TableCell>                
                <TableCell align="right">{indicatorInfo[indicator].pillar}</TableCell>
                <TableCell align="right">{indicatorInfo[indicator].unit}</TableCell>
                <TableCell align="right">
                  {indicatorInfo[indicator]?.unit === 'Yes/No'
                    ? indicatorAverages[indicator]
                    : <NumericLabel>{indicatorAverages[indicator]}</NumericLabel>}
                </TableCell>              
              </TableRow>
            ))}
          </TableBody>}
        </Table>
      </TableContainer>    
    </Box>
  );
}

export default IndustryOverview;