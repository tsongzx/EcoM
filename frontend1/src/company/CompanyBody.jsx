import React, { useEffect, useState } from 'react';
import {
  Typography,
  Stack,
  Box
} from '@mui/material';
import SimpleLineChart from '../SimpleLineChart.jsx';
import Recommendations from './Recommendations.jsx';
import StockAreaChartVisualisation from '../visualisations/StockAreaChartVisualisation.jsx';
import Button from '@mui/joy/Button';
import './company_css/CompanyBody.css'
import { getPrediction } from '../helper.js';

const CompanyBody = ({companyId}) => {
  const [period, setPeriod] = useState('1d');

  return (
    <Box>
      <Box>
        <Stack direction="row" justifyContent="space-between"
          sx={{backgroundColor: "white"}}
        >
          <div>
            <div>
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
            </div>
            {/* <StockAreaChartVisualisation companyName={companyName} period={period} ticker={ticker}/> */}
          </div>
          <Recommendations companyId={companyId}/>
        </Stack>
      </Box>
    </Box>
  );
}

export default CompanyBody;