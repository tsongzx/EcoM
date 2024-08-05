import React, { useState, useEffect } from 'react';
import { Modal, Typography, Grid, Paper, Card, CardContent, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon
import { fetchCompaniesInList, getCompanyFromRecentlyViewed, removeCompanyFromList } from '../helper';
import { useNavigate } from 'react-router-dom';

const ListModal = ({ isOpen, onClose, list, setSelectedCompany }) => {
  const navigate = useNavigate();
  const [companiesInList, setCompaniesInList] = useState([]);
  const [companyNames, setCompanyNames] = useState({});

  useEffect(() => {
    const fetchCompanies = async () => {
      if (list && list.id) {
        const companies = await fetchCompaniesInList(list.id);
        console.log(companies);
        setCompaniesInList(companies);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const getCompanyNames = async() => {
      const newCompanyNames = {};
      for (let id of companiesInList) {
        const companyInterest = await getCompanyFromRecentlyViewed(id);
        newCompanyNames[id] = companyInterest.company_name;
      }
      setCompanyNames(newCompanyNames);
    }
    if (companiesInList.length > 0) {
      getCompanyNames();
    }
    
  }, [companiesInList]);

  const handleDelete = (companyId) => {
    let newCompaniesInList = [];
    for (let element of companiesInList) {
      if (element !== companyId) {
        newCompaniesInList.push(element);
      }
    }
    console.log(list.id);
    removeCompanyFromList(list.id, companyId);
    setCompaniesInList(newCompaniesInList);
  };

  const goToCompany = (companyId) => {
    setSelectedCompany(companyId);
    navigate(`/company/${encodeURIComponent(companyId)}`, 
    { state: { 
      companyId: companyId,
      companyName: companiesInList[companyId],
      initialFramework: null
      } 
    });

  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Paper 
          style={{ 
            padding: '20px', 
            maxWidth: '600px', // restrict the max width
            width: '100%',     // allow it to take full width on smaller screens
            maxHeight: '80%', 
            overflow: 'auto' 
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Companies in {list?.list_name}
            </Typography>
          </div>
          <Grid style={{ marginTop: "20px"}} container spacing={2}>
            {companiesInList.map((companyId) => (
              <Grid item xs={12} key={companyId}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Card style={{ width: '80%'}}>
                    <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => goToCompany(companyId)}>
                      <Typography variant="body1">
                        {companyNames[companyId] || ''}
                      </Typography>
                    </CardContent>
                  </Card>
                  <IconButton onClick={() => handleDelete(companyId)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Grid>
            ))}
          </Grid>
          <Button onClick={onClose} style={{ marginTop: '10px' }}>Close</Button>
        </Paper>
      </Grid>
    </Modal>
  );
};

export default ListModal;
