import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Company = () => {
  const location = useLocation();
  const { companyName } = location.state || {};
	const stateCompanyName = location.state?.companyName;

  const displayCompanyName = companyName || stateCompanyName;

  const handleReturn = () => {
    window.history.back();
  };


	return (
		<div>
			<h1>Company Page</h1>
			{displayCompanyName ? (
				<div>
					<h2>Selected Company: {displayCompanyName}</h2>
				</div>
			) : (
				<h2>No company selected</h2>
			)}
				<Button
					variant="contained"
					color="primary"
					startIcon={<ArrowBackIcon />}
					onClick={handleReturn}
				>
					Return to Dashboard
				</Button>
		</div>
	);
};

export default Company;
