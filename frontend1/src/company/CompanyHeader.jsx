import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './company_css/Company.css'
import NumericLabel from 'react-pretty-numbers';
import {
  addToFavourites,
  deleteFromFavourites,
  getFrameworkAvgScore
} from '../helper.js';
const CompanyHeader = ({ setWatchlistModalOpen, companyId, isInFavs,
  setIsInFavs, companyName, selectedFramework, selectedYear, indicatorsCompany,
  selectedMetrics, selectedIndicators, metricNames, allIndicators, metricScores, allIndicatorsInfo, graphStateChange, ticker
}) => {

  const [esgScore, setESGScore] = useState(null);

  const navigate = useNavigate();

  const openWatchlistModal = () => {
    setWatchlistModalOpen(true);
  };

  useEffect(() => {
    const getScore = async () => {
      if (indicatorsCompany) {
        // Getting prev year..
        const years = Object.keys(indicatorsCompany);
        const sortedYears = [...new Set(years)].sort((a, b) => b - a);
        let year;
        if (years.length > 1) {
          year = sortedYears[1];
        } else {
          year = sortedYears[1];
        }
        // const year = Math.max(...Object.keys(indicatorsCompany));
        console.log(year);
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
    console.log('navigating to /report/', companyId, ' ', companyName, ' fw:', selectedFramework, ' (', selectedYear, ')');
    navigate(`/report/${companyId}`,
      {
        state: {
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
    <Stack id="heading" direction="row" spacing={3} sx={{ marginBottom: '10px', }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{companyName}</Typography>
      <Stack alignItems="center" justifyContent="center">
        {esgScore && <Typography align="center"><NumericLabel>{esgScore}</NumericLabel> / 100</Typography>}
        <Typography align="center">ESG Score</Typography>
      </Stack>
      <Button onClick={handleClickReport}>Save Report</Button>
      <Button onClick={openWatchlistModal}>Add to List</Button>
      <Button onClick={handleToggleFavourite}>{isInFavs ? 'unlike' : 'like'}</Button>
    </Stack>
  );
}

export default CompanyHeader;