import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Card, CardContent, IconButton, Menu, MenuItem, Button } from '@mui/material';
import Navbar from './Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { fetchLists, fetchCompanies, getRecentlyViewed, getCompanyFromRecentlyViewed, fetchIndustries, getCompaniesOfIndustry, getOfficialFrameworks } from './helper.js';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ListModal from './ListModal.jsx';
import ChatFeature from './chatbot/Chatbot.jsx';
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [listOfIndustries, setListOfIndustries] = useState([]);
  const [listOfFrameworks, setListOfFrameworks] = useState({});
  const [lists, setLists] = useState([]);
  const [recents, setRecents] = useState([]);
  const [listOfCompanies, setListOfCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [anchorElement, setanchorElement] = useState(null); // For dropdown menu
  const [selectedList, setSelectedList] = useState(null); 
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [companyNames, setCompanyNames] = useState([]);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(async() => {

    if (selectedIndustry) {
      console.log(selectedIndustry);
      const companyOfIndustry = await getCompaniesOfIndustry(selectedIndustry);
      setListOfCompanies(companyOfIndustry);
    }
  }, [selectedIndustry]);

  // useEffect(() => {
  //   if (selectedCompany !== null) {
  //     navigate(`/company/${encodeURIComponent(selectedCompany.id)}`, { state: { companyId: selectedCompany.id, companyName: selectedCompany.company_name } });
  //   }
  // }, [selectedCompany, navigate]);

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

        const userLists = await fetchLists();
        console.log(userLists);
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
    console.log(recents);
    getRecentlyViewedCompanyNames(recents);
  }, [recents]);

  useEffect(() => {
    console.log(selectedList);
  }, [selectedList]);


  const dashboardToCompany = async (companyId) => {
    try {
      const companyInfo = await getCompanyFromRecentlyViewed(companyId);
      setSelectedCompany(companyInfo);
      navigate(`/company/${encodeURIComponent(companyInfo.id)}`, 
      { state: { 
          companyId: companyInfo.id, 
          companyName: companyInfo.company_name,
          initialFramework: null
        } 
      });
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
    for (let recent of Object.keys(recents)) {
      console.log(recents[recent].company_id);
      const individualCompany = await getCompanyFromRecentlyViewed(recents[recent].company_id);
      nameList.push(individualCompany.company_name);
    }
    console.log(nameList);
    setCompanyNames(nameList);
  }

  const handleCloseListModal = () => {
    setIsListModalOpen(false);
  };

  const handleListClick = (list) => {
    setSelectedList(list); 
    setIsListModalOpen(true); 
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

  useEffect(() => {
    console.log(selectedFramework);
  }, [selectedFramework]);


  return (
    <>
      <Navbar />
      <div id='dashboard-container'>
        <div id='searchbar'>
          Search For A Company
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
        </div>
        <div id='recentlyviewedcontainer'>
          Recently Viewed
          <Grid container spacing={2}>
          {recents.map((recent, index) => (
                    <Grid 
                      style={{ cursor: 'pointer'}} 
                      item xs={2} 
                      key={recent.id}
                      onClick={() => dashboardToCompany(recent.company_id)}
                      wrap='nowrap'
                    >
                      <Card style={{ cursor: 'pointer', height: '120px'}}>
                        <CardContent>
                          <Typography variant="h6">{companyNames[index]}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
          </Grid>
        </div>
        <div id='listcontainer'>
          My Lists
          <Grid container spacing={2}>
                  {Array.isArray(lists) && lists.map((list) => (
                    <Grid item xs={2} key={list.id} style={{ cursor: 'pointer', overflowX:'auto', overflowY: 'hidden' }} 
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
        </div>
      </div>
      {isListModalOpen && <ListModal isOpen={isListModalOpen} onClose={handleCloseListModal} list={selectedList} />} {/* Render ListModal conditionally */}
      <ChatFeature/>
    </>
  );
};

export default Dashboard;
