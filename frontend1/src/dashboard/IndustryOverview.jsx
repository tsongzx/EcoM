import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getIndustryAverages, getIndustryInfo, getIndicatorsInfoByName } from '../helper';
import NumericLabel from 'react-pretty-numbers';

const IndustryOverview = ({ selectedIndustry }) => {
  const [description, setDescription] = useState('');
  const [indicatorAverages, setIndicatorAverages] = useState({});
  const [indicatorInfo, setIndicatorInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const industryInfo = await getIndustryInfo(selectedIndustry);
      setDescription(industryInfo.description);

      const averages = await getIndustryAverages(selectedIndustry);

      let info = null;
      if (Object.keys(indicatorInfo || {}).length === 0) {
        info = await getIndicatorsInfoByName();
        console.log(info);
        setIndicatorInfo(info);
      } else {
        info = indicatorInfo;
      }

      for (const indicator in averages) {
        const curValue = averages[indicator];
        if (info[indicator].unit === 'Yes/No') {
          averages[indicator] = Math.round(curValue) === 0 ? 'No' : 'Yes';
        } else {
          averages[indicator] = curValue; // You can format it if needed
        }
      }
      setIndicatorAverages(averages);
    };
    fetchData();
  }, [selectedIndustry]);

  useEffect(() => {
    const getIndicatorInfo = async () => {
      const info = await getIndicatorsInfoByName();
      console.log(info);
      setIndicatorInfo(info);
    };
    getIndicatorInfo();
  }, []);

  // Prepare data for DataGrid
  const rows = Object.keys(indicatorAverages).map((indicator) => ({
    id: indicator, // Unique identifier
    indicator,
    source: indicatorInfo[indicator]?.source,
    pillar: indicatorInfo[indicator]?.pillar,
    unit: indicatorInfo[indicator]?.unit,
    average: indicatorAverages[indicator]
  }));

  const columns = [
    { field: 'indicator', headerClassName: 'header', headerName: 'Indicator', flex: 3},
    { field: 'source', headerClassName: 'header', headerName: 'Source', flex: 1, align: 'right' },
    { field: 'pillar', headerClassName: 'header', headerName: 'Pillar', flex: 1, align: 'right' },
    { field: 'unit', headerClassName: 'header', headerName: 'Unit', flex: 2, align: 'right' },
    { field: 'average', headerClassName: 'header', headerName: 'Average', flex: 2, align: 'right',
      renderCell: (params) => {
        const unit = indicatorInfo[params.row.indicator]?.unit;
        return unit === 'Yes/No' ? params.value : <NumericLabel>{params.value}</NumericLabel>;
      }
    },
  ];

  return (
    <Box
      sx={{
        height: 'calc(67vh - 50px)',
        width: '100%',
        padding: 2,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h5">Industry Overview</Typography>
      <Typography>{description}</Typography>

      <Paper 
        style={{ height: '100%', width: '100%' }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          // pageSize={10}
          // rowsPerPageOptions={[5, 10, 25]}
          // hideFooter={true}
          hideFooterPagination={true}
          disableSelectionOnClick
          sx={{
            '& .header': {
              backgroundColor: '#7653bd', 
              color: 'white', 
              fontWeight: 'bold', 
            },
            '& .MuiDataGrid-cell': {
              // padding: '0 16px', 
            },
            paddingBottom: 8
          }}
        />
      </Paper>
    </Box>
  );
};

export default IndustryOverview;