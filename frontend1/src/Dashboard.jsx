import {React, useState} from 'react';
import { Grid, Paper, Typography, MenuItem, Select, Card, CardContent, Autocomplete, TextField } from '@mui/material';
import Navbar from './Navbar.jsx';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const industries = ['Industry 1', 'Industry 2', 'Industry 3', 'Industry 4', 'Industry 5'];
  const companies = ['Company 1', 'Company 2', 'Company 3'];


  // const handleChange = (event) => {
  //   setSelectedOption(event.target.value);
  // };

  return (
    <div>
      <Navbar></Navbar>
      {/* <div style={{ maxWidth: '100vw', maxHeight: '100vh', overflowY: 'auto' }}></div> */}
      <div style={{ maxWidth: '100vw', height: 'calc(100vh - 50px)', overflowY: 'auto', paddingTop: '50px' }}>
        <Grid container direction="row" spacing={2} style={{ width: '100%', maxWidth: '100%', height: '100%' }}>
          <Grid item xs={12} style={{ minHeight: '30%'}}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', boxShadow: 'none' }}>
              <Card style={{ width: '40%', boxShadow: 'none' }}>
                <CardContent style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom style={{ color: 'lightgray', alignSelf: 'flex-start' }}>
                    Select Industry
                  </Typography>
                  <Autocomplete
                    style={{ width: '50%' }}
                    options={industries}
                    renderInput={(params) => <TextField {...params} label="Select an option" variant="outlined" />}
                    filterOptions={(options, state) => options.slice(0, 3)}
                  />
                </CardContent>
              </Card>
              <Card style={{ width: '40%', boxShadow: 'none' }}>
                <CardContent style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom style={{ color: 'lightgray', alignSelf: 'flex-start' }}>
                    Select Company
                  </Typography>
                  <Autocomplete style={{ width: '50%'}}
                    options={companies}
                    renderInput={(params) => <TextField {...params} label="Select an option" variant="outlined" />}
                  />
                </CardContent>
              </Card>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ height: '25%', padding: '20px 30px' }}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', boxShadow: 'none' }}>
              <Typography variant="h6" gutterBottom style={{ color: 'lightgray', alignSelf: 'flex-start' }}>
                Favourites (None)
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ height: '25%', padding: '20px 30px' }}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', boxShadow: 'none' }}>
              <Typography variant="h6" gutterBottom style={{ color: 'lightgray', alignSelf: 'flex-start' }}>
                Recently Viewed (None)
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ height: '25%', padding: '20px 30px' }}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', boxShadow: 'none' }}>
              <Typography variant="h6" gutterBottom style={{ color: 'lightgray', alignSelf: 'flex-start' }}>
                My Lists (None)
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ height: '25%' }}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5">Header? Profile? IDK some gibberish</Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
