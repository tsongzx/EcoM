import { Typography } from '@mui/joy';
import { Box, Paper, Stack } from '@mui/material';
import {React, useEffect, useState, useRef} from 'react';
import AddCompany from './AddCompany';
import ClearIcon from '@mui/icons-material/Clear';
import DisplayToggle from './DisplayToggle';
import Select from 'react-select';

const LeftPanel = ({companies, setCompanies, setMessage, setShowMessage, handleDeleteFromTable, handleClickCompanyName, 
  display, setDisplay, frameworks, framework, setFramework
}) => {
 
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
        <Box sx={{height: "10%"}}>
          <DisplayToggle display={display} setDisplay={setDisplay}></DisplayToggle>
          {display === 'framework' && 
            <div className='companyParamContainer'>
                <Select
                  styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                  options={frameworks.map((f) => ({ value: f.id, label: f.name }))}
                  label="Framework"
                  placeholder="Select a framework"
                  maxMenuHeight={100}
                  defaultValue={framework.id ? {value: framework.id, label: framework.name} : null}
                  onChange={(e) => {console.log(e.value); setFramework({id: e.value, name: e.label});}}
                />
            </div>}
        </Box>
       {Array.from({ length: 5 }).map((_, index) => 
        <Paper key={index} sx={{
          height: "18%",
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