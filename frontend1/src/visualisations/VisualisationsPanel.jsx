import React from 'react';
import BarChartStyled from './BarChartStyled';
import { Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisualisationIndicatorsCardInfo from './VisualisationIndicatorsCardInfo';
import VisualisationMetricsCardInfo from './VisualisationMetricsCardInfo';

const VisualisationsPanel = ({ filter, graphValues, info, categories, filterColumn, metricInfoCard }) => {
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
                  {!metricInfoCard && <VisualisationIndicatorsCardInfo info={info[graph]}></VisualisationIndicatorsCardInfo>}
                  {metricInfoCard && <VisualisationMetricsCardInfo info={info[graph]}></VisualisationMetricsCardInfo>}
                  <BarChartStyled data={graphValues[graph]} title={info[graph].name} unit={info[graph].unit ? info[graph].unit : "Metric Score"} categories={categories} />
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