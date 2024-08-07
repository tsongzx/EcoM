import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, FormGroup, FormControlLabel, Checkbox, Pagination, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getHeadquarterCountries, getCompanyByCountryByIndustry } from '../helper.js';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const IndustryPage = ({ selectedIndustry, setSelectedCompany }) => {
  const navigate = useNavigate();

  const [headquarterCountries, setHeadquarterCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [curPage, setCurPage] = useState(1);

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
    <Box sx={{ display: 'flex', height: 'calc(67vh - 50px)' }}>
      <Box
        sx={{
          width: '20%',
          height: 'calc(67vh - 50px)',
          backgroundColor: 'white',
          padding: '20px',
          overflowY: 'scroll',
        }}
      >
        <Typography variant="h6">Headquarter country</Typography>
        <Button variant="contained" onClick={handleSelectAll} sx={{ marginBottom: 1, marginRight: 1 }}>Select All</Button>
        <Button variant="contained" onClick={handleDeselectAll} sx={{ marginBottom: 1 }}>Deselect All</Button>
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
          overflowY: 'scroll',
        }}
      >
        <Pagination page={curPage} count={numPages} onChange={(event, value) => setCurPage(value)} color="secondary"/>
        <TableContainer component={Paper}>
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
                  <TableCell align="right">ESG Score</TableCell>                
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
