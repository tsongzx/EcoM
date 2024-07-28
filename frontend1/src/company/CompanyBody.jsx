import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Stack,
  Box
} from '@mui/material';
import SimpleLineChart from '../SimpleLineChart.jsx';
import Recommendations from './Recommendations.jsx';

const CompanyBody = ({companyId}) => {
  return (
    <Box>
      <Box>
        <Stack direction="row" justifyContent="space-between"
          sx={{backgroundColor: "white"}}
        >
          <SimpleLineChart />
          <Recommendations companyId={companyId}/>
        </Stack>
        <Stack direction="row">
          <Button>AI Predict</Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default CompanyBody;