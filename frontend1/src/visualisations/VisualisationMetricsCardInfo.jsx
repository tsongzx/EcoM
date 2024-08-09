import React, { useEffect, useState } from 'react';
import { Stack, Typography, Box, Paper } from '@mui/material';

const VisualisationMetricsCardInfo = ({info}) => {
  console.log("displaying info card");
  return (
    info ? (
      <Paper elevation={3} sx={{ padding: 2, width: '30%' }}>
        <Stack spacing={1}>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Name: </Typography>
            {info.name}
          </Typography>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Unit: </Typography>
            / 100
          </Typography>
          <Typography variant="body2">
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Category: </Typography>
            {info.category}
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

export default VisualisationMetricsCardInfo;