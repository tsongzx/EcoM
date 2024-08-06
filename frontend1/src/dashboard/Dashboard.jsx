import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Card, CardContent, IconButton, Menu, MenuItem, Button, Container, Box, Stack } from '@mui/material';
import Navbar from '../Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { fetchLists, fetchCompanies, getRecentlyViewed, getCompanyFromRecentlyViewed, fetchIndustries, getCompaniesOfIndustry, getOfficialFrameworks, getFavouritesList, deleteList } from '../helper.js';
import './Dashboard.css'
import ChatFeature from '../chatbot/Chatbot.jsx';
import './Dashboard.css'
import DashboardBody from './DashboardBody.jsx';
import IndustryPage from './IndustryPage.jsx';
import { AsyncPaginate } from 'react-select-async-paginate';

const Dashboard = () => {
  const navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [listOfIndustries, setListOfIndustries] = useState([]);
  const [listOfFrameworks, setListOfFrameworks] = useState({});
  const [page, setPage] = useState(0);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log(page);
    const fetchData = async () => {
      try {
        const industriesAvailable = await fetchIndustries();
        console.log(industriesAvailable);
        setListOfIndustries(industriesAvailable);

        const frameworksAvailable = await getOfficialFrameworks();
        console.log(frameworksAvailable);
        setListOfFrameworks(frameworksAvailable);

      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = () => {
    if (!selectedCompany) {
      setError('Please select a company.')
    } else {
      console.log(selectedFramework);
      console.log(selectedCompany.id);
      navigate(`/company/${encodeURIComponent(selectedCompany.id)}`, 
      { state: { 
          companyId: selectedCompany.id, 
          companyName: selectedCompany.company_name,
          initialFramework: selectedFramework,
          selectedIndustry: selectedIndustry
        } 
      });
    }
  }

  const getOptionValue = (option) => option.value; 

  const getOptionLabel = (option) => option.label;

  return (
    <>
      <Navbar />
        <Box>
          <Stack justifyContent="center" alignItems="center" spacing={3}
            sx={{
              backgroundColor: '#0D2149',
              width: '100%',
              height: '30vh'
            }}
          >
            <Typography variant="h2" color="white" fontFamily="Merriweather">Search For A Company</Typography>
            <Stack direction="row" spacing={3}>
              <Select
                id='industryfilter'
                options={listOfIndustries.map((industry, index) => ({ value: index, label: industry }))}
                placeholder="Industry"
                maxMenuHeight={100}
                onChange={(selectedOption) => setSelectedIndustry(selectedOption.label)}
              />
              <Select
                id='frameworkfilter'
                options={Object.entries(listOfFrameworks).map(([key, framework]) => ({
                value: framework.id,
                label: framework.framework_name,
                }))}
                placeholder="Framework"
                maxMenuHeight={100}
                onChange={(selectedOption) => setSelectedFramework(selectedOption.value)}
              />

              <AsyncPaginate
                key={selectedIndustry ? `industry-${selectedIndustry}` : 'all-companies'}
                value={selectedCompany}
                id='companyfilter'
                placeholder="Company"
                maxMenuHeight={100}
                loadOptions={(search, loadedOptions, additional) => {
                  return selectedIndustry 
                    ? getCompaniesOfIndustry(search, loadedOptions, additional, selectedIndustry)
                    : fetchCompanies(search, loadedOptions, additional);
                }}
                cacheOptions
                // getOptionValue={getOptionValue}
                // getOptionLabel={getOptionLabel}
                onChange={(selectedOption) => setSelectedCompany(selectedOption)}
                additional={{
                  page: 1,
              }}></AsyncPaginate>

              <Button 
                id='gobutton'
                onClick={handleClick}>
                Go
              </Button>
            </Stack>
          </Stack>
          
          {selectedIndustry ? <IndustryPage></IndustryPage> : <DashboardBody page={page} setSelectedCompany={setSelectedCompany}/>}
        </Box>
      <ChatFeature/>
    </>
  );
};

export default Dashboard;
