import {React, useState, useEffect} from 'react';
import { Modal, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { fetchCompaniesInList } from './helper';

const ListModal = ({ isOpen, onClose, list }) => {

  const [companiesInList, setCompaniesInList] = useState({});

  useEffect(async () => {
    const companies = await fetchCompaniesInList(list.id);
    setCompaniesInList(companies);
  }, [])


  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Paper style={{ padding: '20px', maxWidth: '80%', maxHeight: '80%', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Companies in {list.list_name}
          </Typography>
          <Button onClick={onClose} style={{ marginBottom: '10px' }}>Close</Button>
          {/* <Grid container spacing={2}>
            {list.companies.map(company => (
              <Grid item xs={12} key={company.id}>
                <Card>
                  <CardContent>
                    <Typography variant="body1">{company.company_name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid> */}
        </Paper>
      </Grid>
    </Modal>
  );
};

export default ListModal;
