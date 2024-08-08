import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NumericLabel from 'react-pretty-numbers';
import {
  addToFavourites,
  deleteFromFavourites,
  getFrameworkAvgScore
} from '../helper.js';
import { gridAdditionalRowGroupsSelector } from '@mui/x-data-grid/internals';
const CompanyHeader = ({setWatchlistModalOpen, setOpenReportModal, companyId, isInFavs, 
  setIsInFavs, companyName, selectedFramework, selectedYear, indicatorsCompany,
  sliderValuesIndicator, selectedMetrics, selectedIndicators, metricNames, allIndicators, metricScores, allIndicatorsInfo, graphStateChange, ticker
}) => {

  const [esgScore, setESGScore] = useState(null);

  const navigate = useNavigate();

  const openWatchlistModal = () => {
    setWatchlistModalOpen(true);
  };

  const openReportModal = () => {
    setOpenReportModal(true);
  }

  useEffect(() => {
    const getScore = async () => {
      if (indicatorsCompany) {
        // Getting prev year..
        // const years = Object.keys(indicatorsCompany);
        // const sortedYears = [...new Set(years)].sort((a, b) => b - a);
        // let year;
        // if (years.length > 1) {
        //   year = sortedYears[1];
        // } else {
        //   year = year[0];
        // }
        const year = Math.max(...Object.keys(indicatorsCompany));
        const avgScore = await getFrameworkAvgScore([companyName], year);
        console.log(avgScore);
        setESGScore(avgScore[companyName]);
      }
    }
    getScore();
    
  }, [companyName, indicatorsCompany])

  const handleToggleFavourite = () => {
    const companyId_int = Number(companyId);

    if (!isInFavs) {
      addToFavourites(companyId_int);
    } else {
      deleteFromFavourites(companyId_int);
    }
    setIsInFavs(!isInFavs);
  };

  const handleClickReport = () => {
    console.log('navigating to /report/',companyId, ' ', companyName, ' fw:', selectedFramework, ' (', selectedYear,')');
    navigate(`/report/${companyId}`, 
      { state: { 
          id: companyId, 
          companyName,
          framework: selectedFramework,
          year: selectedYear,
          indicatorsCompany,
          selectedIndicators,
          metricNames,
          allIndicators,
          metricScores,
          allIndicatorsInfo,
          graphStateChange,
          selectedMetrics,
          ticker
        } 
      });
  }
  return (
    <Stack id="heading" direction="row" spacing={3}>
      <Typography variant="h3">{companyName}</Typography>
      <Stack alignItems="center" justifyContent="center">
        <Typography align="center">58.78</Typography>
        <Typography align="center">Current Price</Typography>
      </Stack>
      <Stack alignItems="center" justifyContent="center">
        {esgScore && <Typography align="center"><NumericLabel>{esgScore}</NumericLabel></Typography>}
        <Typography align="center">ESG Score</Typography>
      </Stack>
      <Button onClick={handleClickReport}>Save Report</Button>
      {/* <Button onClick={openReportModal}>Save Report</Button> */}
      <Button onClick={openWatchlistModal}>Add to List</Button>
      <Button onClick={handleToggleFavourite}>{isInFavs ? 'unlike' : 'like'}</Button>
    </Stack>
  );
}

export default CompanyHeader;