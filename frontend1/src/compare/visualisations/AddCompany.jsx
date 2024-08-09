
import { Stack } from '@mui/material';
import { React } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CompanySearch from '../CompanySearch';

const AddCompany = ({companies, setCompanies, setMessage, setShowMessage}) => {
  console.log(companies);
  console.log(companies[0]);
  const handleSelectedCompanyId = (companyId, companyName) => {
    if (companies.some(i => i.id === companyId)) {
      setMessage(`Company ${companyName} already added`);
      setShowMessage(true);
      return;
    }

    console.log(`Adding company ${companyId} ${companyName}`);
    const newListOfCompanies = [...companies, {id: companyId, companyName, framework: null, year: null, selected: false}];
    setCompanies(newListOfCompanies);
  }
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{width: '80%'}}>
      <AddCircleOutlineIcon></AddCircleOutlineIcon>
      <CompanySearch props={{width: '80%'}} handleSelectedCompanyId={handleSelectedCompanyId}/>
    </Stack> 
  );
}

export default AddCompany;