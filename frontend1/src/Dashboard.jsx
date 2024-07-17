import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Card, CardContent, IconButton, Menu, MenuItem } from '@mui/material';
import Navbar from './Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { fetchLists, fetchCompanies, getRecentlyViewed, getCompanyFromRecentlyViewed } from './helper.js';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ListModal from './ListModal.jsx';

const Dashboard = () => {
  const navigate = useNavigate();

  const industries = ['Industry 1', 'Industry 2', 'Industry 3', 'Industry 4', 'Industry 5'];

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [lists, setLists] = useState([]);
  const [recents, setRecents] = useState([]);
  const [listOfCompanies, setListOfCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [anchorElement, setanchorElement] = useState(null); // For dropdown menu
  const [selectedList, setSelectedList] = useState(null); // Changed to null initially
  const [companyNames, setCompanyNames] = useState([]);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

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

        const userLists = await fetchLists();
        setLists(userLists);

        const recentlyViewed = await getRecentlyViewed();

        const uniqueRecents = recentlyViewed.reduce((acc, current) => {
          const x = acc.find(item => item.company_id === current.company_id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        
        setRecents(uniqueRecents);

      } catch (error) {
        console.error('Error fetching companies:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    getRecentlyViewedCompanyNames(recents);
  }, [recents]);

  useEffect(() => {
    console.log(selectedList);
  }, [selectedList]);


  const dashboardToCompany = async (companyId) => {
    try {
      const companyInfo = await getCompanyFromRecentlyViewed(companyId);
      setSelectedCompany(companyInfo);
    } catch (error) {
      console.error('Failed to open company', error);
    }
  };

  const handleMenuScrollToBottom = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleDeleteList = (listId) => {
    // Implement logic to delete the list
    console.log(`Delete list ${listId}`);
  };

  const handleEllipsisClick = (event) => {
    setanchorElement(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setanchorElement(null);
  };

  const getRecentlyViewedCompanyNames = async(recents) => {
    console.log(recents);
    let nameList = [];
    for (let recent of recents) {
      console.log(recent.company_id);
      const individualCompany = await getCompanyFromRecentlyViewed(recent.company_id);
      nameList.push(individualCompany.company_name);
    }
    console.log(nameList);
    setCompanyNames(nameList);
  }

  const handleCloseListModal = () => {
    setIsListModalOpen(false);
  };

  const handleListClick = (list) => {
    setSelectedList(list); // Set the selected list
    setIsListModalOpen(true); // Open the modal
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
                  <Typography variant="h6" gutterBottom style={{ color: 'black', alignSelf: 'flex-start' }}>
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
                  <Typography variant="h6" gutterBottom style={{ color: 'black', alignSelf: 'flex-start' }}>
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
          <Grid item xs={12} style={{ padding: '20px 30px' }}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', boxShadow: 'none', flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom style={{ color: 'black', alignSelf: 'flex-start' }}>
                Recently Viewed
              </Typography>
              <Grid container spacing={2}>
                {recents.map((recent, index) => (
                  <Grid 
                    style={{ cursor: 'pointer' }} 
                    item xs={12} 
                    key={recent.id}
                    onClick={() => dashboardToCompany(recent.company_id)}
                  >
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{companyNames[index]}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ height: '25%', padding: '20px 30px' }}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', boxShadow: 'none' }}>
              <Typography variant="h6" gutterBottom style={{ color: 'black', alignSelf: 'flex-start' }}>
                Favourites (None)
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ height: '25%', padding: '20px 30px' }}>
            <Paper style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', boxShadow: 'none' }}>
              <Typography variant="h6" gutterBottom style={{ color: 'black', alignSelf: 'flex-start' }}>
                My Lists
              </Typography>
              <Grid container spacing={2}>
                {Array.isArray(lists) && lists.map((list) => (
                  <Grid item xs={12} md={6} lg={4} key={list.id} style={{ cursor: 'pointer' }} 
                    onClick={() => handleListClick(list)} // Pass the list to handleListClick
                  >
                    <Card>
                      <CardContent style={{ position: 'relative' }}>
                        <Typography variant="h6">{list.list_name}</Typography>
                        <IconButton
                          aria-haspopup="true"
                          onClick={(event) => handleEllipsisClick(event)}
                          style={{ position: 'absolute', top: 0, right: 0 }}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorElement}
                          open={Boolean(anchorElement)}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={() => handleDeleteList(list.id)}>Delete the list</MenuItem>
                        </Menu>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
      {isListModalOpen && <ListModal isOpen={isListModalOpen} onClose={handleCloseListModal} list={selectedList} />} {/* Render ListModal conditionally */}
    </>
  );
};

export default Dashboard;
