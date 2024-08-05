import React, { useEffect, useState } from 'react';
import BarChartStyled from './BarChartStyled';
import { Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisualisationCardInfo from './VisualisationCardInfo';

const VisualisationsPanel = ({filter, graphValues, info, categories, filterColumn, displayInfoCard}) => {
  return (
    <>
      {/* {graphValues ? <BarChartStyled data={graphValues['HUMAN_RIGHTS_VIOLATION_PAI']}/> : <p>Loading...</p>} */}
      <Stack spacing={3}>
        {(graphValues && Object.keys(graphValues).length > 0) ? (Object.keys(graphValues).map((graph, index) => {
          console.log(graph);
          return (filter === 'All' || info[graph][filterColumn] === filter) ? (
            <Accordion defaultExpanded key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                {info[graph].name}
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row">
                  {displayInfoCard && <VisualisationCardInfo info={info[graph]}></VisualisationCardInfo>}
                  <BarChartStyled data={graphValues[graph]} title={info[graph].name} unit={info[graph].unit ? info[graph].unit : "Metric Score"} categories={categories}/>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ) : null;
        })) : null}
      </Stack>
      
    </>
  );
}

export default VisualisationsPanel;