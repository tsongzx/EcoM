import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, FormGroup, FormControlLabel, Checkbox, Pagination, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getHeadquarterCountries, getCompanyByCountryByIndustry, getFrameworkAvgScore } from '../helper.js';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import NumericLabel from 'react-pretty-numbers';

const IndustryPage = ({ selectedIndustry, setSelectedCompany }) => {
  const navigate = useNavigate();

  const [headquarterCountries, setHeadquarterCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const [esgScore, setESGScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const countries = await getHeadquarterCountries();
      setHeadquarterCountries(countries);
      // initially select all countries
      setSelectedCountries(countries);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getScore = async () => {
      const companyNames = companies.map(company => {
        return company.company_name;
      })
      console.log(companyNames);
      const avgScore = await getFrameworkAvgScore(companyNames, 2024);
      console.log(avgScore);
      setESGScore(avgScore);
    }
    getScore();
  }, [companies])

  useEffect(() => {
    const fetchData = async () => {
      const companies = await getCompanyByCountryByIndustry(selectedIndustry, selectedCountries, curPage);
      setCompanies(companies.companies);
      setNumPages(Math.ceil(companies.total / 20));
    };
    fetchData();
  }, [selectedCountries, selectedIndustry, curPage]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedCountries(prevState =>
      checked ? [...prevState, name] : prevState.filter(country => country !== name)
    );
  };

  const handleRowClick = (companyId, companyName) => {
    navigate(`/company/${encodeURIComponent(companyId)}`, 
      { state: { 
          companyId, 
          companyName,
          initialFramework: null
        } 
      });
  };

  const handleSelectAll = () => {
    setSelectedCountries(headquarterCountries);
  };

  const handleDeselectAll = () => {
    setSelectedCountries([]);
  };

  return (
    <Box sx={{ display: 'flex', 
      height: 'calc(67vh - 50px)'
    }}>
      <Box
        sx={{
          width: '20%',
          height: 'calc(67vh - 50px)',
          backgroundColor: 'white',
          padding: '20px',
          overflowY: 'scroll',
        }}
      >
        <Typography variant="h6" fontWeight='bold'
          fontFamily='Merriweather'
        >Filter by headquarter country</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} key={'select'}>
            <Button variant="text" onClick={handleSelectAll}>Select All</Button>
          </Grid>
          <Grid item xs={6} key={'deselect'}>
            <Button variant="text" onClick={handleDeselectAll}>Deselect All</Button>  
          </Grid>
        </Grid>
        <Stack direction="row" spacing={3}>
        </Stack>
        {headquarterCountries && (
          <FormGroup>
            <Grid container spacing={2}>
              {headquarterCountries.map((country, index) => (
                <Grid item xs={6} key={index}>
                  <FormControlLabel 
                    control={
                      <Checkbox
                        name={country}
                        checked={selectedCountries.includes(country)}
                        onChange={handleCheckboxChange}
                      />
                    } label={country} />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        )}
      </Box>
      <Stack alignItems="center"
        sx={{
          width: '80%',
          overflowY: 'scroll'
        }}
      >
        <Pagination page={curPage} count={numPages} onChange={(event, value) => setCurPage(value)} color="secondary"/>
        <TableContainer component={Paper}
          sx={{
            boxSizing: 'border-box',
            padding: '0 2% 5% 0'
          }}
        >
          <Table>
            <TableHead
              sx={{
                '& .MuiTableCell-root': {
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: '#7653bd',
                }
              }}
            >
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell align="right">Headquarter country</TableCell>
                <TableCell align="right">Ticker</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="right">ESG Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies?.map((company, index) => (
                <TableRow key={index}
                  onClick={() => handleRowClick(company.id, company.company_name)} 
                  hover
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{company.company_name}</TableCell>
                  <TableCell align="right">{company.headquarter_country}</TableCell>
                  <TableCell align="right">{company.ticker}</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">{esgScore && <Typography align="center"><NumericLabel>{esgScore[company.company_name]}</NumericLabel></Typography>}</TableCell>                
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}

export default IndustryPage;
