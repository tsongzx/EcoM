import {React, useEffect, useState, useRef} from 'react';
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
  Select,
  Typography
} from '@mui/material';
import { getOfficialFrameworks } from '../helper';
import ContextMenu from './ContextMenu';

const Compare = () => {
  const location = useLocation();
  const { companiesList, selectedFramework } = location.state;
  console.log('Comparing companies with framework: ', selectedFramework);
  console.log(companiesList);

  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [frameworks , setFrameworks] = useState([]);

  const contextMenuRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({
    position: {
      x: 0,
      y: 0
    }, toggled: false
  });
  const [selectedCompany, setSelectedCompany] = useState();

  useEffect(async() => {
    //get all the frameworks
    const fws = await getOfficialFrameworks();
    const modifiedfws = fws.map((framework) => ({
      id: framework.id,
      name: framework.framework_name
    }));
    //set the frameworks
    console.log(modifiedfws);
    setFrameworks(modifiedfws);
    setCompanies(companiesList);
  }, []);

  //DEBUGGING
  useEffect(() => {
    console.log('companies changed:', companies);
  }, [companies]);
  useEffect(() => {
    console.log('frameworks changed:', frameworks);
  }, [frameworks]);

  //given the index that it was selected switch out the company ID at that index to become the new company ID
  const handleSelectedCompanyId = (companyId, companyName) => {
    console.log(`Adding company ${companyId} ${companyName}`);
    const newListOfCompanies = [...companiesList, {id: companyId, companyName, framework: 1, year: 2023, selected: false}];
    setCompanies(newListOfCompanies);
  }

  const handleClickCompanyName = (companyId) => {
    console.log('CLicked company Name at ', companyId);
    //navigate(`/company/${companyId}`);
  }

  const handleSelectedFramework = (companyId) => (selectedOption) =>  {
    const selectedFrameworkId = selectedOption ? selectedOption.value : null;
    console.log('Handing selected Framework: ', selectedFrameworkId, ' for company, ', companyId);
    const newListOfCompanies = companies.map(company => 
      company.id === companyId
          ? { ...company, framework: selectedFrameworkId } // Update the object with new value
          : company // Keep the object unchanged
    );
    setCompanies(newListOfCompanies);
  }

  const handleDeleteFromTable = (companyId) => {
    console.log('deleting from table ', companyId);
    const newListOfCompanies = companies.filter(company => company.companyID !== companyId);
    setCompanies(newListOfCompanies);
  }

  const handleContextMenu = (e, companyId) => {
    console.log('handing opening context menu...', companyId);
    e.preventDefault();
    setSelectedCompany(companyId);
    const contextMenuAttr = contextMenuRef.current.getBoundingClientRect();
    const isLeft = e.clientX < window?.innerWidth / 2;

    let x;
    let y = e.clientY;

    if (isLeft) {
      x = e.clientX;
    } else {
      x = e.clientX - contextMenuAttr.width;
    }

    setContextMenu({
      position: {
        x,
        y
      }, toggled: true
    });

    setCompanies(companies.map(c => {
      return {
        ...c,
        selected: c.id === companyId
      }
    }));
  }

  const resetContextMenu = () => {
    console.log('Resetting context Menu...');
    setSelectedCompany(null);
    //reset everything back to false
    setCompanies(companies.map(c => {
      return {
        ...c,
        selected: false
      }
    }));

    setContextMenu(
      {
        position: {
          x: 0,
          y: 0
        }, toggled: false
      }
    );
  }

  //detect clicking off context menu
  useEffect(() => {
    function handler(e) {
      if (contextMenuRef.current) {
        if (!contextMenuRef.current.contains(e.target)) {
          resetContextMenu();
        }
      }
    }
    document.addEventListener('click', handler);

    return () => {
      console.log('Removing Click Event Handler');
      document.removeEventListener('click', handler);
    }
  },[]);

  //render table cell if company is not null
  return (
    <div>
    <TableContainer>
      <Table>
        {/* Header where Company controls are obtained */}
        <TableHead>
          <TableRow>
            <TableCell>Metrics / Indicators</TableCell>
            {/* Where the companies are rendered */}
            {companies.map((company) => (
              <TableCell onContextMenu={(e) => handleContextMenu(e, company.id)} key={company.id}>
                <div>
                  <a onClick={handleClickCompanyName(company.id)} className={company.selected ? 'selected' : ''} >{company.companyName}</a>
                  <div>
                    <Select
                      styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                      options={frameworks.map((f) => ({ value: f.id, label: f.name }))}
                      label="Framework"
                      maxMenuHeight={100}
                      onChange={handleSelectedFramework(company.id)}
                    />
                  </div>
                </div>
              </TableCell>
            ))}
            {/* Optional If there are less than 5 companies */}
            {companies.length < 5 && (
              <TableCell> 
                <Typography>Add New Company</Typography>
                <CompanySearch handleSelectedCompanyId={handleSelectedCompanyId}/>
              </TableCell>
            )}
          </TableRow>
        </TableHead>

      </Table>
    </TableContainer>
    
    <ContextMenu
      contextMenuRef={contextMenuRef}
      isToggled={contextMenu.toggled}
      positionX={contextMenu.position.x}
      positionY={contextMenu.position.y}
      buttons={[
        {
          text: "delete",
          onClick: () => handleDeleteFromTable(selectedCompany),
        },
      ]}
    />
    </div>
  );
};

export default Compare;
