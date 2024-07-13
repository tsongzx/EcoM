import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../Navbar.jsx';
import './Company.css'
import WatchlistModal from './WatchlistModal.jsx';
import SimpleLineChart from '../SimpleLineChart.jsx';
import CompareModal from '../compare/CompareModal.jsx';
import { getRecentlyViewed, addToFavourites, deleteFromFavourites } from '../helper.js';
import axios from "axios";
import Cookies from "js-cookie";

const Company = () => {
  const location = useLocation();
  const { companyId } = useParams();
  const { companyName } = location.state || {};
	const stateCompanyName = location.state?.companyName;
  const displayCompanyName = companyName || stateCompanyName;
  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [isInFavs, setIsInFavs] = useState(false);
  const token = Cookies.get('authToken');

  useEffect(async () => {
    // Add to recently viewed
    // array should be of size 2
    const companyId_int = Number(companyId.split(" ")[1]);
    await addToRecentlyViewed(companyId_int);
    // Check if in Favourites
    const recentList = await getRecentlyViewed();
    if (Array.isArray(recentList) && recentList.includes(companyId_int)) {
      setIsInFavs(true);
    } else {
      setIsInFavs(false);
    }
  },[]);

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
                    <h1>NDQ</h1>
                    <h3>NASDAQ, inc. ETF</h3>
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

            <div className='metrics'>
                <p>placeholder metrics</p>
                <p>placeholder metrics</p>
                <p>placeholder metrics</p>
                <p>placeholder metrics</p>
                <p>placeholder metrics</p>
                <p>placeholder metrics</p>
                <p>placeholder metrics</p>

                <p>placeholder metrics</p>


                <p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p><p>placeholder metrics</p>
            </div>
            <CompareModal companyName={displayCompanyName} isOpen={compareModalOpen} compareModalOpen={compareModalOpen} setCompareModalOpen={setCompareModalOpen}/>
        </>
	);
};

export default Company;
