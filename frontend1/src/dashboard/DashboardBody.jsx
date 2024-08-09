import { React, useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, IconButton, Menu, MenuItem, Box, Stack } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { fetchLists, getRecentlyViewed, fetchCompanyInfo, getFavouritesList, deleteList } from '../helper.js';
import { useNavigate } from 'react-router-dom';
import ListModal from './list/ListModal.jsx';

const DashboardBody = ({ page, setSelectedCompany }) => {
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [recents, setRecents] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [favsList, setFavsList] = useState([]);
  const [recentCompanyNames, setRecentCompanyNames] = useState([]);
  const [favCompanyNames, setFavCompanyNames] = useState([]);
  const [anchorElement, setanchorElement] = useState(null); // For dropdown menu

  useEffect(() => {
    console.log(page);
    const fetchData = async () => {
      try {
        const userLists = await fetchLists();
        console.log(userLists);
        setLists(userLists);

        const recentlyViewed = await getRecentlyViewed();

        const fetchFavsList = await getFavouritesList();
        console.log(fetchFavsList);
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
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    console.log(recents);
    const setNames = async () => {
      const names = await getCompanyNames(recents);
      setRecentCompanyNames(names);
    }
    setNames();
  }, [recents]);

  useEffect(() => {
    console.log(favsList);
    const setNames = async () => {
      const names = await getCompanyNames(favsList);
      setFavCompanyNames(names);
    }
    setNames();
  }, [favsList]);

  const handleListClick = (list) => {
    setSelectedList(list);
    setIsListModalOpen(true);
    console.log(list);
  };

  const handleDeleteList = (listId) => {
    // Implement logic to delete the list
    deleteList(listId);

    // remove list from userLists on frontend
    const newLists = lists.filter(list => list.id !== listId);
    setLists(newLists);

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

  const getCompanyNames = async (companies) => {
    console.log(companies);
    let nameList = [];
    for (let company of Object.keys(companies)) {
      console.log(companies[company].company_id);
      const individualCompany = await fetchCompanyInfo(companies[company].company_id);
      nameList.push(individualCompany.company_name);
    }
    console.log(nameList);
    return nameList;
  }

  const dashboardToCompany = async (companyId) => {
    try {
      console.log(companyId);
      const companyInfo = await fetchCompanyInfo(companyId);
      setSelectedCompany(companyInfo);
      navigate(`/company/${encodeURIComponent(companyId)}`,
        {
          state: {
            companyId: companyId,
            companyName: companyInfo.company_name,
            initialFramework: null
          }
        });
    } catch (error) {
      console.error('Failed to open company', error);
    }
  };
  return (
    <Stack spacing={3} sx={{
      boxSizing: 'border-box',
      paddingBottom: '5%'
    }}>
      <Stack sx={{
        width: '100vw',
      }}
        alignItems={'center'}
        spacing={2}>
        <Typography sx={{
          color: '#0D2149',
          fontSize: '30px',
          fontWeight: 'bold',
          fontFamily: 'Merriweather',
          textAlign: 'left',
          width: '95vw'
        }}>Recently Viewed</Typography>
        <Grid container spacing={2}
          sx={{
            justifyContent: 'left',
            width: '95vw',
            // marginLeft: 0,
          }}
        >
          {recents.map((recent, index) => (
            <Grid
              style={{
                cursor: 'pointer',
                // width: '15%'
              }}
              item xs={2}
              key={recent.id}
              onClick={() => dashboardToCompany(recent.company_id)}
            >
              <Card sx={{
                cursor: 'pointer', height: '120px', border: 'solid 1px #cfcfcf', borderRadius: '10px',
                '&:hover': {
                  border: 'solid 2px #3373b0',
                },
              }}>
                <CardContent sx={{
                  padding: '16px',
                  '&:hover': {
                    padding: '15px',
                  },
                }}>
                  <Typography variant="h6">{recentCompanyNames[index]}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>

      <Stack sx={{
        width: '100vw'
      }}
        alignItems={'center'}
        spacing={2}>
        <Typography sx={{
          color: '#0D2149',
          fontSize: '30px',
          fontWeight: 'bold',
          fontFamily: 'Merriweather',
          textAlign: 'left',
          width: '95vw'
        }}>Favourites: {favsList.length}</Typography>
        <Grid container spacing={2}
          sx={{
            justifyContent: 'left',
            width: '95vw',
            // marginLeft: 0,
          }}
        >
          {favsList.map((f, index) => (
            <Grid
              style={{ cursor: 'pointer' }}
              item xs={2}
              key={f.company_id}
              onClick={() => dashboardToCompany(f.company_id)}
            >
              <Card sx={{
                cursor: 'pointer', height: '120px', border: 'solid 1px #cfcfcf', borderRadius: '10px',
                '&:hover': {
                  border: 'solid 2px #3373b0',
                },
              }}>
                <CardContent sx={{
                  padding: '16px',
                  '&:hover': {
                    padding: '15px',
                  },
                }}>
                  <Typography variant="h6">{favCompanyNames[index]}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>

      <Stack
        spacing={2}>
        <Stack spacing={2} alignItems="center"
          sx={{
            width: '100vw',
            // marginLeft: 0,
          }}
        >
          <Typography sx={{
            color: '#0D2149',
            fontSize: '30px',
            fontWeight: 'bold',
            fontFamily: 'Merriweather',
            textAlign: 'left',
            width: '95vw'
          }}>My Lists</Typography>
          {Array.isArray(lists) && lists.map((list) => (
            <Box key={list.id} sx={{
              cursor: 'pointer', overflowX: 'auto', overflowY: 'hidden', width: '95%', border: 'solid 1px #cfcfcf', borderRadius: '10px',
              '&:hover': {
                border: 'solid 2px #3373b0',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add a shadow effect on hover
              },
            }}>
              <Card>
                <CardContent style={{
                  position: 'relative', padding: '16px',
                  '&:hover': {
                    padding: '15px',
                  },
                }}>
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
            </Box>
          ))}
        </Stack>
      </Stack>
      {isListModalOpen && <ListModal isOpen={isListModalOpen} onClose={handleCloseListModal} list={selectedList} setSelectedCompany={setSelectedCompany} />}
    </Stack>

  );
}

export default DashboardBody;