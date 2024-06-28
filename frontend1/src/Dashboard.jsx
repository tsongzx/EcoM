import {React, useState, useEffect} from 'react';
import { Grid, Paper, Typography, Card, CardContent, Autocomplete, TextField } from '@mui/material';
import Navbar from './Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const Dashboard = () => {
  const navigate = useNavigate();

  const industries = ['Industry 1', 'Industry 2', 'Industry 3', 'Industry 4', 'Industry 5'];
  const companies = ['Company 1', 'Company 2', 'Company 3'];

  const [selectedCompany, setSelectedCompany] = useState(null);


  useEffect (() => {
    if (selectedCompany !== null) {
      console.log(selectedCompany);
      navigate(`/company/${encodeURIComponent(selectedCompany)}`, { state: { companyName: selectedCompany } });
    }
  }, [selectedCompany, navigate]);



  return (
    <>
      <Navbar /> 

      <div style={{ maxWidth: '100vw', height: '100vh', paddingTop: '50px' }}>
        <Grid container direction="row" spacing={2} style={{ width: '100%', maxWidth: '100%', height: '100%' }}>
          <Grid item xs={12} style={{ minHeight: '30%'}}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', boxShadow: 'none' }}>
              <Card style={{ width: '40%', boxShadow: 'none', minHeight: '30vh' }}>
                <CardContent style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom style={{ color: 'lightgray', alignSelf: 'flex-start' }}>
                    Select Industry
                  </Typography>
                  {/* <Autocomplete
                    style={{ width: '50%', border: '1px solid red'}}
                    options={industries}
                    renderInput={(params) => <TextField {...params} label="Select an option" variant="outlined"/>}
                    filterOptions={(options, state) => options.slice(0, 3)}
                  /> */}
                  <Select
                    styles={{ container: (provided) => ({ ...provided, width: '50%' }) }}
                    options={industries.map(industry => ({ value: industry, label: industry }))}
                    placeholder="Select an option"
                    maxMenuHeight={100}
                  />
                </CardContent>
              </Card>
              <Card style={{ width: '40%', boxShadow: 'none', minHeight: '30vh' }}>
                <CardContent style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom style={{ color: 'lightgray', alignSelf: 'flex-start' }}>
                    Select Company
                  </Typography>
                  {/* <Autocomplete style={{ width: '50%'}}
                    options={companies}
                    renderInput={(params) => <TextField {...params} label="Select an option" variant="outlined" />}
                    filterOptions={(options, state) => options.slice(0, 3)}
                    onChange={(event, newValue) => {
                      setSelectedCompany(newValue);
                    }}
                  /> */}
                  <Select
                    styles={{ container: (provided) => ({ ...provided, width: '50%' }) }}
                    options={companies.map(company => ({ value: company, label: company }))}
                    placeholder="Select an option"
                    onChange={(selectedOption) => setSelectedCompany(selectedOption.value)}
                    maxMenuHeight={100}
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
        </Grid>
      </div>
    </>
  );
};

export default Dashboard;
