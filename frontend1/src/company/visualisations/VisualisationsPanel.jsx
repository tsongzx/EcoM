import React, { useEffect, useState } from 'react';
import BarChartStyled from './BarChartStyled';
import { Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisualisationCardInfo from './VisualisationCardInfo';

const VisualisationsPanel = ({filter, graphValues, indicatorInfo}) => {
  return (
    <>
      {/* {graphValues ? <BarChartStyled data={graphValues['HUMAN_RIGHTS_VIOLATION_PAI']}/> : <p>Loading...</p>} */}
      <Stack spacing={3}>
        {graphValues ? (Object.keys(graphValues).map((indicator) => {
          console.log(graphValues);
          console.log(graphValues[indicator]);
          console.log(filter);
          console.log(indicatorInfo[indicator].pillar);
   
          return (filter === 'All' || indicatorInfo[indicator].pillar === filter) ? (
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${indicator} graph`}
                id={`${indicator} graph`}
              >
                {indicator}
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row">
                  <VisualisationCardInfo indicatorInfo={indicatorInfo[indicator]}></VisualisationCardInfo>
                  <BarChartStyled data={graphValues[indicator]} title={indicator} unit={"Yes / No"} />
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