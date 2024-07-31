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
import { getOfficialFrameworks, getMetricForFramework, getMetricName, calculateGeneralMetricScore } from '../helper';
import ContextMenu from './ContextMenu';
import SearchMetricsModal from './SearchMetricsModal';
import CircularLoader from '../utils/CircularLoader';

const Compare = () => {
  const location = useLocation();
  const { companiesList, selectedFramework } = location.state;
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([{id: 1, name: 'bozo'}]);
  const [metrics, setMetrics] = useState([]);
  const [metricsList, setMetricsList] = useState([]);
  const [frameworks , setFrameworks] = useState([]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [defaultFramework, setDefaultFramework] = useState(null);
  const [year, setYear] = useState(2024);
  const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const contextMenuRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({
    position: {
      x: 0,
      y: 0
    }, toggled: false
  });
  const [isSelectedCompany, setIsSelectedCompany] = useState();
  const [selectedCompany, setSelectedCompany] = useState();

  const setData = async () => {
    console.log('INSIDE INIT USE EFFECT');
    //get all the frameworks
    const fws = await getOfficialFrameworks();
    const modifiedfws = fws.map((framework) => ({
      id: framework.id,
      name: framework.framework_name
    }));
    const fwname = modifiedfws.find(f => f.id === selectedFramework);
    console.log('FW NAME::::', selectedFramework);
    console.log(fwname);
    setDefaultFramework(fwname ? fwname.name : null);

    //set the frameworks
    console.log(modifiedfws);
    setFrameworks(modifiedfws);
    setCompanies(companiesList);
  } 
  useEffect(() => {
    setData();
  }, []);

  //THE ONLY TIME WE UPDATE METRICS IS ON COMPANY CHANGE, FRAMEWORK CHANGE and MODAL CLOSE, and METRIC DELTE
  // useEffect(() => {
  //   console.log('companies changed:', companies);
  //   //update Everytime Companies change, then update metrics
  //   updateMetrics();
  //   ////IF YEAR IS NONE CREATE ANOTHER DISAPPEARING MESSSAGE OR IF COMPANIES = 5 or more
  // }, [companies]);
  // useEffect(() => {
  //   console.log('frameworks changed:', frameworks);
  //   updateMetrics();
  //   //IF YEAR IS NONE CREATE DISAPPEARING MESSAGE
  // }, [frameworks]);
  useEffect(() => {
    console.log('ContextMENU changed:', contextMenu, ' company selected at ', selectedCompany);
  }, [contextMenu, selectedCompany]);
  useEffect(() => {
    //everytime the metricsList changes, update the metrics to match
    console.log('metricsList changed so Imma change metrics!!!!');
    changeMetrics();
  },[metricsList]);
  // useEffect(() => {
  //   //everytime the metricsList changes, update the metrics to match
  //   console.log('metricsList changed so Imma change metrics!!!!');
  //   changeMetrics();
  // },[year]);

  useEffect(() => {
    console.log('updating metrics:');
    updateMetrics();
  },[year, frameworks, companies]);

  useEffect(() => {
    console.log('METRICS CHANGED:');
    console.log(metrics);
  },[metrics]);

  //given the index that it was selected switch out the company ID at that index to become the new company ID
  const handleSelectedCompanyId = (companyId, companyName) => {
    console.log(`Adding company ${companyId} ${companyName}`);
    const newListOfCompanies = [...companies, {id: companyId, companyName, framework: 1, year: 2023, selected: false}];
    setCompanies(newListOfCompanies);
  }

  //This function updates the metrics that are being used depending on the frameworks that are being selected
  //This returns a list of JSON objects [{metric_id: , metricName}]
  //This is called everytime a framework or company changes and only adds onto the exisitng list without repalcing the old one

  const updateMetrics = async () => {
    const processedFrameworks = new Set();
    const updatedMetrics = [];
  
    await Promise.all(companies.map(async (c) => {
      if (c.framework && !processedFrameworks.has(c.framework)) {
        processedFrameworks.add(c.framework);
  
        const frameworkMetrics = await getMetricForFramework(c.framework);
        console.log(frameworkMetrics);
        updatedMetrics.push(...frameworkMetrics);
      }
    }));
    
    //gets a list of {metric_id, metric_name}
    const newMetrics = await Promise.all(
      updatedMetrics
        .filter(m => !metricsList.some(i => i.metric_id === m.metric_id))
        .map(async m => ({
          metric_id: m.metric_id,
          metric_name: await getMetricName(m.metric_id)
        }))
    );

    setMetricsList(prevMetricsList => [...prevMetricsList, ...newMetrics]);
  };
  
  // This is from the Adding tool (the modal)
  const changeMetrics = async () => {
    setLoading(true);
    const metricsPromises = metricsList.map((m) => {
      console.log('mapping metric: ',m.metric_id, '/', metricsList.length);
      return calculateGeneralMetricScore(m.metric_id, m.metric_name, companies, year);
    });

    const newMetrics = await Promise.all(metricsPromises);
    console.log('inside change metrics...');
    console.log(metricsList);
    console.log(newMetrics);
    setMetrics(newMetrics);
    setLoading(false);
  }

  //add metric
  const deleteMetric = (metricId) => {
    //const newMetrics = metrics.filter((m) => m.metric_id !== metricId);
    const newMetricList = metricsList.filter((m) => m.metric_id !== metricId);
    //THis line may become redundnat due to the useEffect
    //setMetrics(newMetrics);
    console.log('DELETING A METRIC');
    console.log(newMetricList);
    setMetricsList(newMetricList);
    resetContextMenu();
  }
  

  const handleClickCompanyName = (companyId, companyName, framework) => {
    console.log('Clicked company Name at ', companyId);
    navigate(`/company/${encodeURIComponent(companyId)}`, 
      { state: { 
          companyId, 
          companyName,
          initialFramework: framework
        } 
      });
  }

  const handleSelectedFramework = async (companyId, selectedOption) =>  {
    const foundC = companies.find(company => company.id === companyId);
    if (foundC.framework == selectedOption) {
      console.log(`Already has company ${companyId} with that framework: `, selectedOption);
      //CREATE DISAPPEARING MESSAGE FOR THIS
      //IF YEAR IS NONE CREATE ANOTHER DISAPPEARING MESSAGE
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
    
    //MOST LIKELY TO GET DELETED FOR NEW IMPLEMENTATION
    //Change the metrics to match the selected Framework
    // if (!selectedFramework) {
    //   const newListOfMetrics = metrics.map(metric => 
    //     metric.companyId === companyId ?
    //       {companyId, metrics: null}
    //       : metric
    //   );
    //   setMetrics(newListOfMetrics);
    //   return;
    // }
    // //get the metrics
    // const metricsForFramework = await getMetricForFramework(selectedFrameworkId);
    // const newListOfMetrics = metrics.map(metric => 
    //   metric.companyId === companyId ?
    //     {companyId, metrics: metricsForFramework}
    //     : metric
    // );
    // setMetrics(newListOfMetrics);
  }

  const handleDeleteFromTable = (companyId) => {
    console.log('deleting from table ', companyId);
    const newListOfCompanies = companies.filter(company => company.id !== companyId);
    console.log('DELETED COMPANIES');
    console.log(newListOfCompanies);
    setCompanies(newListOfCompanies);
    setIsDeleting(true);
  }

  const handleContextMenu = (e, companyId, isCompany) => {
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
    setIsSelectedCompany(isCompany);
  }

  const resetContextMenu = () => {
    console.log('Resetting context Menu...');

    setSelectedCompany(null);
    //reset everything back to false
    console.log(companies);
    if (isSelectedCompany) {
      const newListOfCompanies = companies.map(company => 
        ({ ...company, selected: false })
      );
      console.log(newListOfCompanies);
      setCompanies(newListOfCompanies);
    }

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
    if (!open) {
      console.log('Adding event Listener');
      document.addEventListener('click', handler);
    }

    // console.log('Removing Click Event Handler');
    // document.removeEventListener('click', handler);
    return () => {
      console.log('Removing Click Event Handler');
      document.removeEventListener('click', handler);
    }
  },[contextMenu, open]);

  //because there has been problems with resetContextMenu using old company data
  useEffect(() => {
    if (isDeleting) {
      resetContextMenu();
      setIsDeleting(false); // Reset the flag
    }
  }, [companies, isDeleting]);

  const handleCloseModal = (newMetricsList) => {
    console.log('Closing Modal...');
    console.log(newMetricsList);
    setMetricsList(newMetricsList);
    setOpen(false);
  }

  const handleToggleOpenModal = () => {
    setOpen(!open);
  }

  //render table cell if company is not null
  return (
    <div>
    <Navbar/>
    {loading && <CircularLoader/>}
    <TableContainer className='table'>
      <Table>
        {/* Header where Company controls are obtained */}
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography>Metrics</Typography>
              {/* Put button for Metrics change here */}
              <Select
                      styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                      options={years.map((year) => ({ value: year, label: year }))}
                      label="Year"
                      // value={year}
                      // defaultValue= {year}
                      maxMenuHeight={100}
                      onChange={(e) => setYear(e.value)}
                    />
            </TableCell>
            {/* Where the companies are rendered */}
            {companies.map((company, index) => (
              <TableCell onContextMenu={(e) => handleContextMenu(e, company.id, true)} key={index}>
                <div>
                  <a onClick={() => handleClickCompanyName(company.id, company.companyName, company.framework)} className={company.selected ? 'selected compare-anchor' : 'compare-anchor'} >{company.companyName}</a>
                  <div className='companyParamContainer'>
                    <Select
                      styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                      options={frameworks.map((f) => ({ value: f.id, label: f.name }))}
                      label="Framework"
                      maxMenuHeight={100}
                      defaultValue={selectedFramework ? {value: selectedFramework, label: defaultFramework} : null}
                      onChange={(selectedOption) => handleSelectedFramework(company.id, selectedOption)}
                    />
                    {/* insert years filter here */}
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
        
        {/* This is the part that renders all the table components */}
        {metrics.map((metric, index) => (
          <TableRow>
            <TableCell onContextMenu={(e) => handleContextMenu(e, metric.metricId, false)}>{metric.metricName}</TableCell>
            {metric.companies.map((company, index) => (
              <TableCell>
                {company.score}
              </TableCell>
            ))}
          </TableRow>
        ))}

      </Table>
    </TableContainer>
    
    <ContextMenu
      contextMenuRef={contextMenuRef}
      isToggled={contextMenu.toggled}
      positionX={contextMenu.position.x}
      positionY={contextMenu.position.y}
      buttons={isSelectedCompany ? [
        {
          text: "delete",
          onClick: () => handleDeleteFromTable(selectedCompany),
        },
      ] :
      [
        {
          text: "delete metric",
          onClick: () => deleteMetric(selectedCompany), // This is abit dodgy because its actually getting passed in a metricId
        },
      ]
    }
    />

    <button onClick={handleToggleOpenModal}>Customise Metrics List</button>
    <SearchMetricsModal isOpen={open} closeModal={handleCloseModal} metricsList={metricsList}/>
    </div>
  );
};

export default Compare;
