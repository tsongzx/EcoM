import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Collapse,
  Card,
} from '@mui/material';
import {
  getMetricForFramework,
  getMetricName,
  getIndicatorsForMetric,
} from '../helper.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// This component contains a list of radio buttons, which shows the framework the user
// has chosen and/or allows them to choose a framework of their choice.
const SelectFramework = ({setSelectedFramework, setMetricNames, setSelectedMetrics,
  setAllIndicators, setSelectedIndicators, selectedFramework, officialFrameworks
}) => {

  // This section is collapsable/expandable
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // This function handles the event that a framework has been chosen or if the
  // user decides to switch from one framework to another
  const handleFrameworkChange = async (event) => {
    const frameworkId = Number(event.target.value);
    setSelectedFramework(frameworkId);
    
    // Gets all the metrics and indicators for a specific framework
    const metrics = await getMetricForFramework(frameworkId);
    if (metrics) {
      const nameOfMetrics = [];
      const metricIds = [];
      for (const item of Object.values(metrics)) {
        const name = await getMetricName(item.metric_id);
        nameOfMetrics.push({ id: item.metric_id, name: name });
        metricIds.push(item.metric_id);
      }
      setMetricNames(nameOfMetrics);
      
      setSelectedMetrics(metricIds);
      
      const newAllIndicators = {};
      for (const id of metricIds) {
        try {
          const indicators = await getIndicatorsForMetric(frameworkId, id);
          newAllIndicators[id] = indicators;
        } catch (error) {
          console.log(error);
        }
      }

      // Sets the metrics and indicators to those determined
      setAllIndicators(newAllIndicators);
      
      const newSelectedIndicators = {};
      for (const id of metricIds) {
        newSelectedIndicators[id] = newAllIndicators[id].map(indicator => indicator.indicator_id);
      }
      setSelectedIndicators(newSelectedIndicators);
    }
  };

  return (
    <Card style={{ marginTop: '20px'}}>
      <FormControl style={{ marginLeft: '1.5vw', cursor: 'pointer' }} component="fieldset">
        <FormLabel component="legend" onClick={handleExpandClick}>
          Select Framework
          <IconButton onClick={handleExpandClick} size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </FormLabel>
        <Collapse in={expanded}>
          <RadioGroup
            aria-labelledby="select-framework-radio-buttons-group"
            name="select-framework-radio-buttons-group"
            value={selectedFramework ? String(selectedFramework) : ''}
            onChange={handleFrameworkChange}
          >
            {officialFrameworks &&
              Object.entries(officialFrameworks).map(([key, framework]) => (
                <FormControlLabel key={key} value={framework.id} control={<Radio />} label={<span style={{ fontSize: '17px' }}>{framework.framework_name}</span>} />
              ))}
          </RadioGroup>
        </Collapse>
      </FormControl>
    </Card>
  );
}

export default SelectFramework;
