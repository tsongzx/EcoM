import {React, useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CompanySearch from './CompanySearch';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  Collapse,
  Card,
  Grid,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tab,
  Select
} from '@mui/material';
const Compare = () => {
  const location = useLocation();
  const { companiesInput, selectedFramework } = location.state;

  const navigate = useNavigate();

  const [companies, setCompanies] = useState([companiesInput.companies]);
  const [frameworks , setFrameworks] = useState(selectedFramework);

  useEffect(() => {
    console.log(selectedFramework);
    //updated companies to match list of {companyID, companyName}
  }, [selectedFramework]);

  //given the index that it was selected switch out the company ID at that index to become the new company ID
  const handleSelectedCompanyId = (companyId) => {
    return companyId;
  }

  const handleClickCompanyName = (companyID) => {

  }

  const handleSelectedFramework = () => {

  }

  //render table cell if company is not null
  return (
    <TableContainer>
      <Table>
        {/* Header where Company controls are obtained */}
        <TableHead>
          <TableRow>
            <TableCell>Metrics / Indicators</TableCell>
            {companies.map((company) => (
              <TableCell>
                <div>
                  <a onClick={handleClickCompanyName(company.id)}>{company.companyName}</a>
                  <div>
                    <Select
                      styles={{ container: (provided) => ({ ...provided, width: '50%' }) }}
                      options={listOfIndustries.map((industry, index) => ({ value: index, label: industry }))}
                      label="Framework"
                      maxMenuHeight={100}
                      onChange={handleSelectedFramework}
                    />
                    <Select/>
                  </div>
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
};

export default Compare;
