import React, { useEffect, useState } from 'react';
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

const SelectFramework = ({setSelectedFramework, setMetricNames, setSelectedMetrics,
  setAllIndicators, setSelectedIndicators, selectedFramework, officialFrameworks
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFrameworkChange = async (event) => {
    const frameworkId = Number(event.target.value) + 1;
    setSelectedFramework(frameworkId);

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
      setAllIndicators(newAllIndicators);
      
      const newSelectedIndicators = {};
      for (const id of metricIds) {
        console.log(id);
        newSelectedIndicators[id] = newAllIndicators[id].map(indicator => indicator.indicator_id);
      }
      console.log(newSelectedIndicators);
      setSelectedIndicators(newSelectedIndicators);
    }
  };

  return (
    <Card style={{ marginTop: '20px', marginLeft: '40px'}}>
      <FormControl style={{ marginLeft: '20px', cursor: 'pointer' }} component="fieldset">
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
            value={selectedFramework ? String(selectedFramework - 1) : ''}
            onChange={handleFrameworkChange}
          >
            {officialFrameworks &&
              Object.entries(officialFrameworks).map(([key, framework]) => (
                <FormControlLabel key={key} value={key} control={<Radio />} label={<span style={{ fontSize: '17px' }}>{framework.framework_name}</span>} />
              ))}
          </RadioGroup>
        </Collapse>
      </FormControl>
    </Card>
  );
}

export default SelectFramework;