import React, { useState } from 'react';
import {
  Stack,
  Box
} from '@mui/material';
import Recommendations from './Recommendations.jsx';
import StockAreaChartVisualisation from '../visualisations/StockAreaChartVisualisation.jsx';
import Button from '@mui/joy/Button';
import './company_css/CompanyBody.css'
import CompanySummary from './CompanySummary.jsx';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

const CompanyBody = ({companyId, companyName}) => {
  const [period, setPeriod] = useState('1mo');
  // const [showGraph, setShowGraph] = useState(true);

  return (
    <Box>
      <Box>
        <Stack direction="row" justifyContent="space-between"
          sx={{backgroundColor: "white"}}
        >
          <div className='livedata-section'>
            <Tabs defaultValue={0} className='companySummaryTabs'>
              <TabList>
                <Tab >Graph</Tab>
                <Tab>Summary</Tab>
              </TabList>

            
              <TabPanel value={0}>
              <div className='companybodysummary-ggg-container'>
                {<div className='liveData-buttons'>
                  <Button size="sm" variant={`${period === '1d' ? 'soft' : 'plain'}`} color={`${period === '1d' ? 'primary' : 'neutral'}`} onClick={() => setPeriod("1d")} 
                    className={`period-select-button ${period === '1d' ? 'active-psb' : ''}`}> 1d </Button>
                  <Button size="sm" variant={`${period === '5d' ? 'soft' : 'plain'}`} color={`${period === '5d' ? 'primary' : 'neutral'}`} onClick={() => setPeriod("5d")}
                    className={`period-select-button ${period === '5d' ? 'active-psb' : ''}`}> 5d </Button>
                  <Button size="sm" variant={`${period === '1mo' ? 'soft' : 'plain'}`} color={`${period === '1mo' ? 'primary' : 'neutral'}`} onClick={() => setPeriod("1mo")} 
                    className={`period-select-button ${period === '1mo' ? 'active-psb' : ''}`}> 1m </Button>
                  <Button size="sm" variant={`${period === '6mo' ? 'soft' : 'plain'}`} color={`${period === '6mo' ? 'primary' : 'neutral'}`} onClick={() => setPeriod("6mo")}
                    className={`period-select-button ${period === '6mo' ? 'active-psb' : ''}`}> 6m </Button>
                  <Button size="sm" variant={`${period === '1yr' ? 'soft' : 'plain'}`} color={`${period === '1yr' ? 'primary' : 'neutral'}`} onClick={() => setPeriod("1yr")}
                    className={`period-select-button ${period === '1yr' ? 'active-psb' : ''}`}> 1y </Button>
                </div>}
                <StockAreaChartVisualisation className='Stockareachartvis' companyName={companyName} period={period} ticker={"AMZN"}/>
              </div>
              </TabPanel>
              <TabPanel value={1}>
              <CompanySummary companyName={companyName} ticker={"AMZN"}/>
              </TabPanel>
            </Tabs>          
          </div>
          <Recommendations companyId={companyId}/>
        </Stack>
      </Box>
    </Box>
  );
}

export default CompanyBody;