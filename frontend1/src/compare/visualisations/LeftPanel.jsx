import { Typography } from '@mui/joy';
import { Box, Paper, Stack } from '@mui/material';
import {React, useEffect, useState, useRef} from 'react';
import AddCompany from './AddCompany';
import ClearIcon from '@mui/icons-material/Clear';

const LeftPanel = ({companies, setCompanies, setMessage, setShowMessage, handleDeleteFromTable, handleClickCompanyName}) => {
 
  console.log(companies);
  console.log(companies[0]);
  return (
    <Stack
      sx={{
        width: '30vw',
        backgroundColor: 'white',
        overflow: "hidden",
        overflowY: "scroll",
        justifyContent: "space-evenly"
      }}>
       {Array.from({ length: 5 }).map((_, index) => 
        <Paper key={index} sx={{
          height: "20%",
          display: "flex",
          justifyContent:"center",
          alignItems:"center",
          // borderRadius:"5%"
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{width: '90%'}}>
            {index < companies.length ? (
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{width: '100%'}}>
                 <a onClick={() => handleClickCompanyName(companies[index].id, companies[index].companyName, null)}>
                    <Typography>{companies[index].companyName}</Typography>
                  </a> 
                <ClearIcon color="grey" onClick={() => handleDeleteFromTable(companies[index].id)}/>
              </Stack>
            ) : (
              <AddCompany companies={companies} setCompanies={setCompanies} setMessage={setMessage} setShowMessage={setShowMessage}/>
            )}
          </Stack>
        </Paper>
      )}
        
    </Stack>
  )
}

export default LeftPanel;