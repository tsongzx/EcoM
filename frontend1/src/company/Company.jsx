import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../Navbar.jsx';
import './Company.css'
import WatchlistModal from './WatchlistModal.jsx';
import SimpleLineChart from '../SimpleLineChart.jsx';

const Company = () => {
  const location = useLocation();
  const { companyId } = useParams();
  const { companyName } = location.state || {};
	const stateCompanyName = location.state?.companyName;
  const displayCompanyName = companyName || stateCompanyName;
  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);

  const handleReturn = () => {
    window.history.back();
  };

  const openWatchlistModal = () => {
    setWatchlistModalOpen(true);
  }

  const handleCloseWatchList = () => {
    setWatchlistModalOpen(false);
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
            <WatchlistModal isOpen={watchlistModalOpen} handleClose={handleCloseWatchList}/>
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
                    <Button>Like</Button>
                </div>
            </div>
            <div className = 'chartAndReccomendations'>
              <div className = 'chart'>
                {/* Charts Component Goes Here*/}
                <SimpleLineChart/>
                <div className='chartControls'>
                  <Button onClick={openWatchlistModal}>Add to List</Button>
                  <Button>AI Predict</Button>
                  <Button>Compare</Button>
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
        </>
	);
};

export default Company;
