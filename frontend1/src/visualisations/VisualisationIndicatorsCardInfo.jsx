import React, { useEffect, useState } from 'react';
import { Stack, Typography, Box, Paper } from '@mui/material';

const VisualisationIndicatorsCardInfo = ({info}) => {
  console.log("displaying info card");
  return (
    info ? (
      <Paper elevation={3} sx={{ padding: 2, width: '30%' }}>
        <Stack spacing={1}>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Data Type: </Typography>
            {info.data_type}
          </Typography>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Unit: </Typography>
            {info.unit}
          </Typography>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Pillar: </Typography>
            {info.pillar}
          </Typography>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Source: </Typography>
            {info.source}
          </Typography>
          <Typography variant="body2">
            {info.description}
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

export default VisualisationIndicatorsCardInfo;