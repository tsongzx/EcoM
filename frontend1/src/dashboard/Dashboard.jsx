import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Stack } from '@mui/material';
import Navbar from '../navbar/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { fetchCompanies, fetchIndustries, getCompaniesOfIndustryByBatch, getOfficialFrameworks } from '../helper.js';
import './Dashboard.css'
import ChatFeature from '../chatbot/Chatbot.jsx';
import './Dashboard.css'
import DashboardBody from './DashboardBody.jsx';
import { AsyncPaginate } from 'react-select-async-paginate';
import IndustryTab from './IndustryTab.jsx';

const Dashboard = () => {
  const navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [listOfIndustries, setListOfIndustries] = useState([]);
  const [listOfFrameworks, setListOfFrameworks] = useState({});
  const [selectedFramework, setSelectedFramework] = useState(null);

  useEffect(() => {
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
    console.log("Go clicked!");
    if (!selectedCompany) {
      console.log("error set");
    } else {
      console.log(selectedFramework);
      console.log(selectedCompany);
      navigate(`/company/${encodeURIComponent(selectedCompany.value)}`,
        {
          state: {
            companyId: Number(selectedCompany.value),
            companyName: selectedCompany.label,
            initialFramework: selectedFramework,
          }
        });
    }
  }

  return (
    <Box
      sx={{
        height: 'calc(100vh - 50px)'
      }}
    >
      <Navbar />
      <Box sx={{ marginTop: '-25px' }}>
        <Stack justifyContent="center" alignItems="center" spacing={3}
          sx={{
            backgroundColor: '#0D2149',
            width: '100vw',
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
                  ? getCompaniesOfIndustryByBatch(search, loadedOptions, additional, selectedIndustry)
                  : fetchCompanies(search, loadedOptions, additional);
              }}
              cacheOptions
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

        {selectedIndustry ? <IndustryTab selectedIndustry={selectedIndustry} setSelectedCompany={setSelectedCompany}></IndustryTab> : <DashboardBody setSelectedCompany={setSelectedCompany} />}
      </Box>
      <ChatFeature />
    </Box>
  );
};

export default Dashboard;
