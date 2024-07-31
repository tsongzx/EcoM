import React, { useEffect, useState } from 'react';
import { Stack, Typography, Box, Paper } from '@mui/material';

const VisualisationCardInfo = ({indicatorInfo}) => {
  return (
    indicatorInfo ? (
      <Paper elevation={3} sx={{ padding: 2, width: '30%' }}>
        <Stack spacing={1}>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Data Type: </Typography>
            {indicatorInfo.data_type}
          </Typography>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Unit: </Typography>
            {indicatorInfo.unit}
          </Typography>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Pillar: </Typography>
            {indicatorInfo.pillar}
          </Typography>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Source: </Typography>
            {indicatorInfo.source}
          </Typography>
          <Typography variant="body2">
            {indicatorInfo.description}
          </Typography>
        </Stack>
      </Paper>
    ) : (
      <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
        <Typography variant="h6">...loading</Typography>
      </Stack>
    )
  );
}

export default VisualisationCardInfo;