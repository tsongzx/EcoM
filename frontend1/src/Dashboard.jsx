import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import Navbar from './Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import ListElement from './ListElement.jsx';
import { fetchLists, fetchCompanies } from './helper.js';

const Dashboard = () => {
  const navigate = useNavigate();

  const industries = ['Industry 1', 'Industry 2', 'Industry 3', 'Industry 4', 'Industry 5'];

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [lists, setLists] = useState([]);
  const [recents, setRecents] = useState([]);
  const [favs, setFavs] = useState([]);
  const [listOfCompanies, setListOfCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (selectedCompany !== null) {
      navigate(`/company/${encodeURIComponent(selectedCompany.id)}`, { state: { companyId: selectedCompany.id, companyName: selectedCompany.company_name } });
    }
  }, [selectedCompany, navigate]);

  useEffect(() => {
    console.log(page);
    const fetchData = async () => {
      setLoading(true);
      try {
        const companiesAvailable = await fetchCompanies(page);
        setListOfCompanies(prevCompanies => [...prevCompanies, ...companiesAvailable]);
        setHasMore(companiesAvailable.length > 0);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
      setLoading(false);
    };

    const userLists = fetchLists();
    setLists(userLists);
    fetchData();
  }, [page]);

  useEffect(() => {
    console.log(listOfCompanies);
  }, [listOfCompanies]);

  const handleMenuScrollToBottom = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: '100vw', height: '100vh', paddingTop: '50px' }}>
        <Grid container direction="row" spacing={2} style={{ width: '100%', maxWidth: '100%', height: '100%' }}>
          <Grid item xs={12} style={{ minHeight: '30%' }}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', boxShadow: 'none' }}>
              <Card style={{ width: '40%', boxShadow: 'none', minHeight: '30vh' }}>
                <CardContent style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom style={{ color: 'lightgray', alignSelf: 'flex-start' }}>
                    Select Industry
                  </Typography>
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
                  <Select
                    styles={{ container: (provided) => ({ ...provided, width: '50%' }) }}
                    options={listOfCompanies.map(company => ({ value: company.id, label: company.company_name }))}
                    placeholder="Select an option"
                    onChange={(selectedOption) => setSelectedCompany(listOfCompanies.find(company => company.id === selectedOption.value))}
                    maxMenuHeight={100}
                    onMenuScrollToBottom={handleMenuScrollToBottom}
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
            {Array.isArray(lists) && lists?.map((list) => (
              <ListElement key={list.id} id={list.id} name={list.list_name} dateCreated={list.created_at}/>
            ))}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Dashboard;
