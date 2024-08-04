import {React, useEffect, useState, useRef} from 'react';
import {
  Typography,
  Box
} from '@mui/material';
import LeftPanel from './LeftPanel.jsx';
import MetricVisualisations from './MetricVisualisations.jsx';
import IndicatorVisualisation from './IndicatorVisualisations.jsx';

const Visualisation = ({companies, frameworks, setCompanies, setMessage, setShowMessage, handleDeleteFromTable, handleClickCompanyName}) => {
    
  const [display, setDisplay] = useState('indicators');
  const [framework, setFramework] = useState({});

  return (
    <Box>
      <Box sx={{
        height: 'calc(100vh - 5vh)',
        display: 'flex',
        position: 'relative',
      }}>
        <LeftPanel companies={companies} setCompanies={setCompanies} setMessage={setMessage}
          setShowMessage={setShowMessage} handleDeleteFromTable={handleDeleteFromTable}
          handleClickCompanyName={handleClickCompanyName} display={display} setDisplay={setDisplay} framework={framework}
          setFramework={setFramework} frameworks={frameworks}></LeftPanel>
        <Box component="main" sx={{ 
          // flexGrow: 1, 
          width: '70vw',
          padding: '2vh 1vw 0 1vw',
          overflow: "hidden",
          overflowY: "scroll",
        }}>
          { display === 'indicators' && (<IndicatorVisualisation companies={companies.map(company => company.companyName)}/>)}
          {display === 'framework' && (framework.id ? (<MetricVisualisations framework={framework} companies={companies.map(company => company.companyName)}/>) :
          (<Typography>Select a framework</Typography>)  
        )}
        </Box>
      </Box>
    </Box>
  );
}

export default Visualisation;