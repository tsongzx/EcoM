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
  Typography
} from '@mui/material';
import Select from 'react-select';
import Navbar from '../Navbar';
import { getOfficialFrameworks, getMetricForFramework } from '../helper';
import ContextMenu from './ContextMenu';

const Compare = () => {
  const location = useLocation();
  const { companiesList, selectedFramework } = location.state;
  console.log('Comparing companies with framework: ', selectedFramework);
  console.log(companiesList);

  const navigate = useNavigate();

  const [companies, setCompanies] = useState([{id: 1, name: 'bozo'}]);
  const [metrics, setMetrics] = useState([]);
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
    console.log('INSIDE INIT USE EFFECT');
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
  useEffect(() => {
    console.log('ContextMENU changed:', contextMenu, ' company selected at ', selectedCompany);
  }, [contextMenu, selectedCompany]);

  //given the index that it was selected switch out the company ID at that index to become the new company ID
  const handleSelectedCompanyId = (companyId, companyName) => {
    console.log(`Adding company ${companyId} ${companyName}`);
    const newListOfCompanies = [...companies, {id: companyId, companyName, framework: 1, year: 2023, selected: false}];
    setCompanies(newListOfCompanies);
  }

  const handleClickCompanyName = (companyId) => {
    console.log('Clicked company Name at ', companyId);
    //navigate(`/company/${companyId}`);
  }

  const handleSelectedFramework = async (companyId, selectedOption) =>  {
    const foundC = companies.find(company => company.id === searchId);
    if (foundC.framework == selectedOption) {
      console.log(`Already has company ${companyId} with that framework: `, selectedOption);
      return;
    }

    const selectedFrameworkId = selectedOption ? selectedOption.value : null;
    console.log('Handing selected Framework: ', selectedFrameworkId, ' for company, ', companyId);
    const newListOfCompanies = companies.map(company => 
      company.id === companyId
          ? { ...company, framework: selectedFrameworkId } // Update the object with new value
          : company // Keep the object unchanged
    );
    setCompanies(newListOfCompanies);
    
    //Change the metrics to match the selected Framework
    if (!selectedFramework) {
      const newListOfMetrics = metrics.map(metric => 
        metric.companyId === companyId ?
          {companyId, metrics: null}
          : metric
      );
      setMetrics(newListOfMetrics);
      return;
    }
    //get the metrics
    const metricsForFramework = await getMetricForFramework(selectedFrameworkId);
    const newListOfMetrics = metrics.map(metric => 
      metric.companyId === companyId ?
        {companyId, metrics: metricsForFramework}
        : metric
    );
    setMetrics(newListOfMetrics);
  }

  const handleDeleteFromTable = (companyId) => {
    console.log('deleting from table ', companyId);
    const newListOfCompanies = companies.filter(company => company.id !== companyId);
    setCompanies(newListOfCompanies);
    resetContextMenu();
  }

  const handleContextMenu = (e, companyId) => {
    console.log('handling opening context menu...', companyId);
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
    console.log(companies);
    const newListOfCompanies = companies.map(company => 
      ({ ...company, selected: false })
    );
    console.log(newListOfCompanies);
    setCompanies(newListOfCompanies);

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
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
          console.log('just before reset', contextMenu);
          if (contextMenu.toggled){
            //only do reset if context menu is toggled
            resetContextMenu();
          } 
      }
    }
    console.log('Adding event Listener');
    document.addEventListener('click', handler);

    return () => {
      console.log('Removing Click Event Handler');
      document.removeEventListener('click', handler);
    }
  },[contextMenu]);

  //render table cell if company is not null
  return (
    <div>
    <Navbar/>
    <TableContainer className='table'>
      <Table>
        {/* Header where Company controls are obtained */}
        <TableHead>
          <TableRow>
            <TableCell>Metrics / Indicators</TableCell>
            {/* Where the companies are rendered */}
            {companies.map((company) => (
              <TableCell onContextMenu={(e) => handleContextMenu(e, company.id)} key={company.id}>
                <div>
                  <a onClick={() => handleClickCompanyName(company.id)} className={company.selected ? 'selected' : ''} >{company.companyName}</a>
                  <div>
                    <Select
                      styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                      options={frameworks.map((f) => ({ value: f.id, label: f.name }))}
                      label="Framework"
                      maxMenuHeight={100}
                      onChange={(selectedOption) => handleSelectedFramework(company.id, selectedOption)}
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
