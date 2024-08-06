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

const Dashboard = () => {
  const navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [listOfIndustries, setListOfIndustries] = useState([]);
  const [listOfFrameworks, setListOfFrameworks] = useState({});
  const [listOfCompanies, setListOfCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [error, setError] = useState(false);

  const setIndustryAndCompany = async() => {
    if (selectedIndustry) {
      console.log(selectedIndustry);
      const companyOfIndustry = await getCompaniesOfIndustry(selectedIndustry);
      setListOfCompanies(companyOfIndustry);
    }
  }
  useEffect(() => {
    setIndustryAndCompany();
  }, [selectedIndustry]);

  useEffect(() => {
    console.log(page);
    const fetchData = async () => {
      setLoading(true);
      try {

        const industriesAvailable = await fetchIndustries();
        console.log(industriesAvailable);
        setListOfIndustries(industriesAvailable);

        const companiesAvailable = await fetchCompanies(page);
        setListOfCompanies(prevCompanies => [...prevCompanies, ...companiesAvailable]);
        setHasMore(companiesAvailable.length > 0);

        const frameworksAvailable = await getOfficialFrameworks();
        console.log(frameworksAvailable);
        setListOfFrameworks(frameworksAvailable);

      } catch (error) {
        console.error('Error fetching companies:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [page]);

  const handleMenuScrollToBottom = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

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

              <Select
                id='companyfilter'
                options={listOfCompanies.map(company => ({ value: company.id, label: company.company_name }))}
                placeholder="Company"
                onChange={(selectedOption) => setSelectedCompany(listOfCompanies.find(company => company.id === selectedOption.value))}
                maxMenuHeight={100}
                onMenuScrollToBottom={handleMenuScrollToBottom}
              />

              <Button 
                id='gobutton'
                onClick={handleClick}>
                Go
              </Button>
            </Stack>
          </Stack>
          
          <DashboardBody page={page} setSelectedCompany={setSelectedCompany}/>
        </Box>
      <ChatFeature/>
    </>
  );
};

export default Dashboard;
