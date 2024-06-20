import React, { useEffect } from 'react';
import { Card, Typography, Button } from '@mui/material';

const Home = () => {

	const printHi = () => {
		console.log('hi');
	}

	return (
		<Card style={{ display: 'flex', flexDirection: 'row', border: '1px solid blue' }}>
			<Card style={{ border: '1px solid red', width: '50%' }}/>
			<Card style={{ border: '1px solid red', width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
				<Button type="submit" variant="contained" style={{ border: '1px solid red', right: '0' }} onClick={printHi}>Login</Button>
				<Button style={{ border: '1px solid red', right: '0' }} onClick={printHi}>Signup</Button>
			</Card>
		</Card>
	);
};

export default Home;

