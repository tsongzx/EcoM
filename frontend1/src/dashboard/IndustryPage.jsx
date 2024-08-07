import {React, useEffect, useState} from 'react';
import { Grid, Paper, Typography, Card, CardContent, IconButton, Menu, MenuItem, Button, Container, Box, Stack, FormGroup, FormControlLabel, Checkbox, Pagination } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { fetchLists, getRecentlyViewed, fetchCompanyInfo, getFavouritesList, deleteList, getHeadquarterCountries, getCompanyByCountryByIndustry } from '../helper.js';
import { useNavigate } from 'react-router-dom';
import ListModal from './list/ListModal.jsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const IndustryPage = ({selectedIndustry, setSelectedCompany}) => {
  const navigate = useNavigate();

  const [headquarterCountries, setHeadquarterCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [curPage, setCurPage] = useState(1);

  useEffect(() => {
    const fetchData = async() => {
      const countries = await getHeadquarterCountries();
      setHeadquarterCountries(countries);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async() => {
      const companies = await getCompanyByCountryByIndustry(selectedIndustry, selectedCountries, curPage);
      console.log(companies);
      setCompanies(companies.companies);
      setNumPages(Math.ceil(companies.total / 20));
      console.log(companies.total);
    }
    fetchData();
  }, [selectedCountries, selectedIndustry, curPage])

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedCountries(prevState =>
      checked ? [...prevState, name] : prevState.filter(country => country !== name)
    );
  };

  const handleRowClick = (companyId, companyName) => {
    console.log('Clicked company Name at ', companyId);
    navigate(`/company/${encodeURIComponent(companyId)}`, 
      { state: { 
          companyId, 
          companyName,
          initialFramework: null
        } 
      });
  }

  return (
    <Box sx={{display: 'flex', height: 'calc(67vh - 50px)'}}>
      <Box
        sx={{
          width: '25%',
          height: 'calc(67vh - 50px)',
          // height: '100%',
          backgroundColor: 'white',
          padding: '20px',
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        <Typography variant="h6">Headquarter country</Typography>
        {headquarterCountries && (
          <FormGroup
            sx={{
              // height: '40vh',
              overflow: "hidden",
              overflowY: "scroll",
            }}
          >
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
      <Box
        sx={{
          width: '75%',
          // height: '100%',
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        <Pagination page={curPage} count={numPages} onChange={(event, value) => {console.log(value);setCurPage(value);}} color="secondary"/>
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
      </Box>
    </Box>
  );
}

export default IndustryPage;