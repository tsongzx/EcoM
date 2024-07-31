import {React, useEffect, useState, useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CompanySearch from '../CompanySearch.jsx';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  Stack,
  Box
} from '@mui/material';
import Select from 'react-select';
import Navbar from '../../Navbar.jsx';
import { getOfficialFrameworks, getMetricForFramework, getMetricName, calculateMetricScore } from '../../helper.js';
import ContextMenu from '../ContextMenu.jsx';
import SearchMetricsModal from '../SearchMetricsModal.jsx';
import CircularLoader from '../../utils/CircularLoader.jsx';
import SelfExpiringMessage from '../../assets/SelfExpiringMessage.jsx';
import Button from '@mui/joy/Button';
import GraphTableToggle from '../../utils/GraphTableToggle.jsx';
import LeftPanel from './LeftPanel.jsx';

const Visualisation = ({companies, setCompanies, setMessage, setShowMessage, handleDeleteFromTable, handleClickCompanyName}) => {

  // const [companyMap, setCompanyMap] = useState(companies.reduce((map, company) => {
  //   map[company.id] = company.companyName;
  //   return map;
  // }, {}));

  return (
    <Box>
      <Box sx={{
        height: 'calc(100vh - 5vh)',
        display: 'flex',
        position: 'relative',
      }}>
        <LeftPanel companies={companies} setCompanies={setCompanies} setMessage={setMessage}
          setShowMessage={setShowMessage} handleDeleteFromTable={handleDeleteFromTable}
          handleClickCompanyName={handleClickCompanyName}></LeftPanel>
        <Box component="main" sx={{ 
          // flexGrow: 1, 
          width: '70vw',
          padding: '2vh 1vw 0 1vw',
          overflow: "hidden",
          overflowY: "scroll",
        }}>
          
        </Box>
      </Box>
    </Box>
  );
}

export default Visualisation;