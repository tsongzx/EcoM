import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Collapse, Card } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../Navbar.jsx';
import './Company.css'
import WatchlistModal from './WatchlistModal.jsx';
import SimpleLineChart from '../SimpleLineChart.jsx';
import CompareModal from '../compare/CompareModal.jsx';
import { getRecentlyViewed, addToFavourites, deleteFromFavourites, getOfficialFrameworks, getIndicatorInfo, getMetricForFramework, getMetricName } from '../helper.js';
import axios from "axios";
import Cookies from "js-cookie";
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
  const [indicatorInfo, setIndicatorInfo] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [metricNames, setMetricNames] = useState(null);
  const token = Cookies.get('authToken');

  useEffect(async () => {
    // Add to recently viewed
    // array should be of size 2
    // const companyId_int = Number(companyId.split(" ")[1]);
    // await addToRecentlyViewed(companyId_int);
    console.log(companyId);
    await addToRecentlyViewed(companyId);
    // Check if in Favourites
    const recentList = await getRecentlyViewed();
    if (Array.isArray(recentList) && recentList.includes(companyId)) {
      setIsInFavs(true);
    } else {
      setIsInFavs(false);
    }

    const availableOfficialFramework = await getOfficialFrameworks();
    setOfficialFrameworks(availableOfficialFramework);

    const availableIndicatorInfo = await getIndicatorInfo(displayCompanyName);
    setIndicatorInfo(availableIndicatorInfo);
  },[]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(selectedFramework);
      if (selectedFramework) {
        const metrics = await getMetricForFramework(true, selectedFramework);
        if (metrics) {
          const nameOfMetrics = [];
          for (const item of Object.values(metrics)) {
            const name = await getMetricName(item.metric_id);
            nameOfMetrics.push(name);
          }
          setMetricNames(nameOfMetrics);
        }
        console.log(metrics);
      }
    };
  
    fetchData();
  }, [selectedFramework]);

  useEffect(() => {
    console.log(indicatorInfo);
  }, [indicatorInfo]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClick1 = () => {
    setExpanded1(!expanded1);
  };

  const addToRecentlyViewed = async (cId) => {
    console.log(cId);
    if (!token) {
      console.error('No authToken cookie found');
    }
    console.log(token);
    try {
      const response = await axios.post(`http://127.0.0.1:8000/recently_viewed?company_id=${cId}`,
        {}, 
        {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      console.log(response.data);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const handleReturn = () => {
    window.history.back();
  };

  const openWatchlistModal = () => {
    setWatchlistModalOpen(true);
  }

  const handleCloseWatchList = () => {
    setWatchlistModalOpen(false);
  }

  const openCompareModal = () => {
    setCompareModalOpen(true);
  }

  const handleToggleFavourite = () => {
    setIsInFavs(!isInFavs);
    //depending on isInFavs, either add or delete from favourites (called WatchList in backend)
    const companyId_int = Number(companyId.split(" ")[1]);
    
    if (isInFavs) {
      addToFavourites(companyId_int);
    } else {
      deleteFromFavourites(companyId_int);
    }
  }

  const handleFrameworkChange = (event) => {
    setSelectedFramework(Number(event.target.value) + 1);
  }

	return (
        <>
        <Navbar/>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleReturn}
            >
              Return to Dashboard
            </Button>
            <WatchlistModal isOpen={watchlistModalOpen} handleClose={handleCloseWatchList} companyId={companyId}/>
            <div className = 'companyHeading'>
                {/* {displayCompanyName ? (
                    <div>
                        <h2>Selected Company: {displayCompanyName}</h2>
                    </div>
                ) : (
                    <h2>No company selected</h2>
                )} */}
                <div className = 'metainfoContainer'>
                  <div className = 'companyName metainfo'>
                    <h1>{companyName}</h1>
                    <h3>NASDAQ, inc. ETF - What is this for?</h3>
                  </div>
                  <div className = 'currentPrice metainfo'>
                    <h2> 58.78</h2>
                    <p>current price</p>
                  </div>
                  <div className = 'esgScore metainfo'>
                    <h2>80.1</h2>
                    <p>ESG Score</p>
                  </div>
                </div>
                <div className = 'quickControls'>
                    <Button>Save Report</Button>
                    <Button onClick={handleToggleFavourite}>{isInFavs ? 'unlike' : 'like'}</Button>
                </div>
            </div>
            <div className = 'chartAndReccomendations'>
              <div className = 'chart'>
                {/* Charts Component Goes Here*/}
                <SimpleLineChart/>
                <div className='chartControls'>
                  <Button onClick={openWatchlistModal}>Add to List</Button>
                  <Button>AI Predict</Button>
                  <Button onClick={openCompareModal}>Compare</Button>
                </div>
              </div>
              <p>recommendations placeholder</p>
              {/* Recommended Companies Component goes here*/}
            </div>
            <Card>
              <FormControl style={{ marginLeft: '20px', cursor: 'pointer'}} component="fieldset">
                <FormLabel component="legend" onClick={handleExpandClick}>
                  Select Framework
                  <IconButton onClick={handleExpandClick} size="small">
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </FormLabel>
                <Collapse in={expanded}>
                  <RadioGroup>
                    {officialFrameworks && Object.entries(officialFrameworks).map(([key, framework]) => (
                      <FormControlLabel key={key} value={key} control={<Radio />} label={framework.framework_name} onChange={handleFrameworkChange}/>
                    ))}
                  </RadioGroup>
                </Collapse>
              </FormControl>
            </Card>
            <Card style={{ marginTop: '100px' }}>
              <FormControl style={{marginLeft: '20px', cursor: 'pointer'}} component="fieldset">
                <FormLabel component="legend" onClick={handleExpandClick1}>
                  Metrics and Indicators
                  <IconButton onClick={handleExpandClick1} size="small">
                    {expanded1 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </FormLabel>
                <Collapse in={expanded1}>
                  <RadioGroup>
                    {metricNames && metricNames.map((name, index) => (
                      <FormControlLabel key={index} value={name} control={<Radio />} label={name} />
                    ))}
                  </RadioGroup>
                </Collapse>
              </FormControl>
            </Card>
            <CompareModal companyName={displayCompanyName} isOpen={compareModalOpen} compareModalOpen={compareModalOpen} setCompareModalOpen={setCompareModalOpen}/>
        </>
	);
};

export default Company;
