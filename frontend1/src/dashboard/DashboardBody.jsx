import {React, useEffect, useState} from 'react';
import { Grid, Paper, Typography, Card, CardContent, IconButton, Menu, MenuItem, Button, Container, Box, Stack } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { fetchLists, getRecentlyViewed, getCompanyFromRecentlyViewed, getFavouritesList, deleteList } from '../helper.js';
import { useNavigate } from 'react-router-dom';
import ListModal from './ListModal.jsx';

const DashboardBody = ({page, setSelectedCompany}) => {
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState(null); 
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [favsList, setFavsList] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const [anchorElement, setanchorElement] = useState(null); // For dropdown menu

  useEffect(() => {
    console.log(page);
    const fetchData = async () => {
      setLoading(true);
      try {
        const userLists = await fetchLists();
        console.log(userLists);
        setLists(userLists);

        const recentlyViewed = await getRecentlyViewed();

        const fetchFavsList = await getFavouritesList();
        setFavsList(fetchFavsList);

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

  const handleListClick = (list) => {
    setSelectedList(list); 
    setIsListModalOpen(true); 
    console.log(list);
  };

  const handleDeleteList = (listId) => {
    // Implement logic to delete the list
    deleteList(listId);

  };

  const handleEllipsisClick = (event) => {
    setanchorElement(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setanchorElement(null);
  };

  const handleCloseListModal = () => {
    setIsListModalOpen(false);
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
  return (
    <>
      <div id='recentlyviewedcontainer'>
        Recently Viewed
        <Grid container spacing={2}>
        {recents.map((recent, index) => (
                  <Grid 
                    style={{ cursor: 'pointer'}} 
                    item xs={2} 
                    key={recent.id}
                    onClick={() => dashboardToCompany(recent.company_id)}
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
      <div className='favouritescontainer'>
        <Typography variant="h6" gutterBottom style={{ color: 'black', alignSelf: 'flex-start' }}>
          Favourites {favsList.length}
        </Typography>
        <Grid container spacing={2}>
          {favsList.map((f, index) => (
            <Grid 
              style={{ cursor: 'pointer' }} 
              item xs={12} 
              key={f.company_id}
              onClick={() => dashboardToCompany(f.company_id)}
            >
          <Card>
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
            >
              <Card>
                <CardContent style={{ position: 'relative' }}>
                  <div onClick={() => handleListClick(list)}>
                    <Typography variant="h6">{list.list_name}</Typography>
                  </div>
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
      {isListModalOpen && <ListModal isOpen={isListModalOpen} onClose={handleCloseListModal} list={selectedList} setSelectedCompany={setSelectedCompany}/>}
    </>
    
  );
}

export default DashboardBody;