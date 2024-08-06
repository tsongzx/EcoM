import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  addToFavourites,
  deleteFromFavourites
} from '../helper.js';
const CompanyHeader = ({setWatchlistModalOpen, setOpenReportModal, companyId, isInFavs, 
  setIsInFavs, companyName, selectedFramework, selectedYear, indicatorsCompany,
  sliderValuesIndicator, selectedMetrics, selectedIndicators, metricNames, allIndicators, metricScores, allIndicatorsInfo
}) => {

  console.log(indicatorsCompany);
  const navigate = useNavigate();

  const openWatchlistModal = () => {
    setWatchlistModalOpen(true);
  };

  const openReportModal = () => {
    setOpenReportModal(true);
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
        <Typography align="center">80.1</Typography>
        <Typography align="center">ESG Score</Typography>
      </Stack>
      <Button onClick={handleClickReport}>Save Report</Button>
      <Button onClick={openReportModal}>Save Report</Button>
      <Button onClick={openWatchlistModal}>Add to List</Button>
      <Button onClick={handleToggleFavourite}>{isInFavs ? 'unlike' : 'like'}</Button>
    </Stack>
  );
}

export default CompanyHeader;