import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const CompareModal = ({ companyName, isOpen, compareModalOpen, setCompareModalOpen }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([{ value: companyName, label: companyName }]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleClose = () => {
    setCompareModalOpen(false);
    setSelectedCompanies([{ value: companyName, label: companyName }]);
    setError(null);
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption && !selectedCompanies.find(company => company.value === selectedOption.value)) {
      if (selectedCompanies.length < 5) {
        setSelectedCompanies([...selectedCompanies, selectedOption]);
        setError(null);
      } else {
        setError('You can select a maximum of 5 companies.');
      }
    }
    setSelectedCompany(null);
  };

  const handleDelete = (companyToDelete) => {
    setSelectedCompanies(selectedCompanies.filter(company => company.value !== companyToDelete));
    setError(null);
  };

  const options = [
    { value: 'Company 1', label: 'Company 1' },
    { value: 'Company 2', label: 'Company 2' },
    { value: 'Company 3', label: 'Company 3' },
    { value: 'Company 4', label: 'Company 4' },
    { value: 'Company 5', label: 'Company 5' },
    { value: 'Company 6', label: 'Company 6' },
  ];

  const handleCompare = () => {
    if (selectedCompanies.length < 2) {
      setError('Please select at least 2 companies to compare.');
    } else {
      navigate('/compare', { state: { companies: selectedCompanies } });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
    >
      <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
        <Paper style={{ minWidth: '50%', minHeight: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 16 }}>
          <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <Typography variant="h4" component="h1" fontWeight="bold">Add More Companies</Typography>
          </Box>
          <Box style={{ display: 'flex', flexDirection: 'column', marginTop: '15px', width: '100%' }}>
            <Typography variant="h6" component="h1" fontWeight="bold">
              Selected Companies ({selectedCompanies.length}/5)
            </Typography>
            {selectedCompanies.map((company, index) => (
              <Box key={index} style={{ display: 'flex', flexDirection: 'row', marginTop: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
                <Paper style={{ padding: '10px', width: '70%', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                  <Typography variant="subtitle1" fontWeight="bold">{company.label}</Typography>
                </Paper>
                {index > 0 && (
                  <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => handleDelete(company.value)} />
                )}
              </Box>
            ))}
          </Box>
          <Box style={{ display: 'flex', flexDirection: 'column', marginTop: '30px', width: '100%' }}>
            <Typography variant="h6" component="h1" fontWeight="bold">Add Companies</Typography>
            <Select
              value={selectedCompany}
              onChange={handleSelectChange}
              options={options}
              placeholder="Select a company..."
              styles={{ container: base => ({ ...base, width: '73%' }), menu: base => ({ ...base, maxHeight: '100px', overflowY: 'auto' }) }}
            />
            {error && (
              <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
                {error}
              </Typography>
            )}
          </Box>
          <Box style={{display: "flex", width: "100%", justifyContent: 'space-between'}} mt={2}>
            <Button onClick={handleClose} variant="contained" color="primary" sx={{ mr: 2 }}>Close</Button>
            <Button onClick={handleCompare} variant="contained" color="secondary">Compare</Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default CompareModal;
