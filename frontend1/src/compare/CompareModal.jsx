import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from 'react-select';
import { fetchCompanies, fetchIndustries, getCompaniesOfIndustry } from '../helper';
import { useNavigate } from 'react-router-dom';

const CompareModal = ({ companyId, companyName, isOpen, compareModalOpen, setCompareModalOpen, selectedFramework }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([{ value: companyId, label: companyName }]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [listOfIndustries, setListOfIndustries] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(companyName);
  }, []);

  useEffect(() => {
    console.log(selectedCompanies);
  }, [selectedCompanies]);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const completeIndustryList = await fetchIndustries();
        setListOfIndustries(completeIndustryList);

        const completeCompanyList = await fetchCompanies(page);
        const filteredCompanyList = completeCompanyList.filter(company => company.company_name !== companyName);
        console.log(filteredCompanyList);
        setAllCompanies(prevCompanies => [...prevCompanies, ...filteredCompanyList]);
        setHasMore(completeCompanyList.length > 0);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
      setLoading(false);
    };
    fetchCompany();
  }, [page]);

  useEffect(async () => {
    if (selectedIndustry) {
      console.log(selectedIndustry);
      const companyOfIndustry = await getCompaniesOfIndustry(selectedIndustry.label);
      console.log(companyOfIndustry);
      const companyOfIndustryFiltered = companyOfIndustry.filter(company => company !== companyName);
      setAllCompanies(companyOfIndustryFiltered);
    }
  }, [selectedIndustry]);

  const handleClose = () => {
    setCompareModalOpen(false);
    setSelectedCompanies([{ value: companyId, label: companyName }]);
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

  const handleMenuScrollToBottom = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  //set default framework if Framework is NULL
  const handleCompare = () => {
    if (selectedCompanies.length < 2) {
      setError('Please select at least 2 companies to compare.');
    } else {
      console.log('handling compare with...');
      const compareCompanies = selectedCompanies.map((company) => ({
        id: company.value,
        companyName: company.label,
        framework: selectedFramework ?? 1,
        year: null,
        selected: false
    }));
    console.log(compareCompanies);
      navigate('/compare', { state: { companiesList: compareCompanies, selectedFramework } });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
    >
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Paper style={{ minWidth: '50%', minHeight: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 16 }}>
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
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

          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Box style={{ display: 'flex', flexDirection: 'column', marginTop: '30px', width: '100%' }}>
              <Typography variant="h6" component="h1" fontWeight="bold">Add Industry</Typography>

              <Select
                value={selectedIndustry}
                styles={{ container: (provided) => ({ ...provided, width: '50%' }) }}
                options={listOfIndustries.map((industry, index) => ({ value: index, label: industry }))}
                placeholder="Select an option"
                maxMenuHeight={100}
                onChange={(selectedOption) => {
                  console.log("Selected Industry:", selectedOption.label); // Log the selected industry name
                  setSelectedIndustry(selectedOption);
                }}
              />
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', marginTop: '30px', width: '100%' }}>
              <Typography variant="h6" component="h1" fontWeight="bold">Add Companies</Typography>
              <Select
                value={selectedCompany}
                onChange={handleSelectChange}
                options={allCompanies.map(company => ({ value: company.id, label: company.company_name }))}
                placeholder="Select a company..."
                styles={{
                  container: base => ({ ...base, width: '73%' }),
                  menu: base => ({ ...base, maxHeight: '100px' }), // Set max height for the menu
                  menuList: base => ({ ...base, maxHeight: '100px', overflowY: 'auto' }) // Ensure only menuList has scroll
                }}
                onMenuScrollToBottom={handleMenuScrollToBottom}
              />
              {error && (
                <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
                  {error}
                </Typography>
              )}
            </Box>
          </div>
          <Box style={{ display: "flex", width: "100%", justifyContent: 'space-between', marginTop: '120px' }} mt={2}>
            <Button onClick={handleClose} variant="contained" color="primary" sx={{ mr: 2 }}>Close</Button>
            <Button onClick={handleCompare} variant="contained" color="secondary">Compare</Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default CompareModal;
