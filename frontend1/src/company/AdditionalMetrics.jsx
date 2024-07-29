import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  Collapse,
  Card,
  Slider,
  TextField,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const AdditionalMetrics = ({ selectedIndicators, selectedMetrics, metricNames, setSelectedIndicators, setSelectedMetrics,
  allIndicators, allIndicatorsInfo, setMetricNames, setAllIndicators,
  sliderValues, sliderValuesFixed, sliderValuesIndicatorFixed, metricNamesFixed,
  selectedMetricsFixed, allIndicatorsFixed, selectedIndicatorsFixed, sliderValuesIndicator,
  setSliderValuesIndicator, setSliderValues, allMetrics, selectedFramework, setSelectedFramework, updateMetricName
}) => {

  const [unselectedMetrics, setUnselectedMetrics] = useState([]);
  const [open, setOpen] = useState({ E: true, S: true, G: true });
  const [expanded2, setExpanded2] = useState(false);

  useEffect(() => {
    let unselectedMetrics1 = [];
    console.log(allMetrics);
    Object.keys(allMetrics).forEach((key) => {
      allMetrics[key].forEach((item) => {
        let unselectedMetricObject = {};
        if (metricNames && !metricNames.some(item1 => item1.id === item.id)) {
          unselectedMetricObject['id'] = item.id;
          unselectedMetricObject['name'] = item.name;
					unselectedMetricObject['category'] = item.category;
          unselectedMetricObject['weighting'] = 0;
          unselectedMetrics1.push(unselectedMetricObject);
        }
      });
    });
		console.log(unselectedMetrics1);
    setUnselectedMetrics(unselectedMetrics1);
  }, [metricNames]);

	useEffect(() => {
		console.log(metricNamesFixed);
	}, [metricNamesFixed]);

  const handleAdditionalClick = (unselectedMetricId) => {
		let unselectedObject = {};
		for (const category in allMetrics) {
				unselectedObject = allMetrics[category].find(metric => metric.id === unselectedMetricId);
				if (unselectedObject) {
						unselectedObject.weighting = 0; // Modify a property of an object
						break;
				}
		}
		
		// Create a new array for metricNames
		const newMetricNames = [...metricNames];
		if (!newMetricNames.some(metric => metric.id === unselectedObject.id)) {
				newMetricNames.push(unselectedObject);
		}
		
		// Create a new array for selectedMetrics
		const selectedMetricsCopy = [...selectedMetrics];
		if (!selectedMetricsCopy.includes(unselectedMetricId)) {
				selectedMetricsCopy.push(unselectedMetricId);
		}
		
		// Update the state
		updateMetricName(newMetricNames, selectedMetricsCopy);
		
		// Create a new array for unselectedMetrics
		const newArray = unselectedMetrics.filter(item => item.id !== unselectedMetricId);
		setUnselectedMetrics(newArray);


  }

	useEffect(() => {
		console.log(metricNames);
	}, [metricNames]);

  const handleCategoryClick = (category) => {
    setOpen(prevOpen => ({ ...prevOpen, [category]: !prevOpen[category] }));
  };

	const handleExpandClick2 = () => {
    setExpanded2(!expanded2);
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', marginTop: '2vh' }}>
			<FormControl style={{ marginLeft: '1.5vw', display: 'flex', flexDirection: 'column', flex: '1' }} component="fieldset">
				<FormLabel component="legend" onClick={handleExpandClick2} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
					Additional Metrics
					<IconButton onClick={handleExpandClick2} size="small">
						{expanded2 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
					</IconButton>
				</FormLabel>
				<Collapse in={expanded2}>
					{['E', 'S', 'G'].map(category => (
						<div key={category} style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
							<div
								style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}
								onClick={() => handleCategoryClick(category)}
							>
								<Typography style={{ fontSize: '25px', fontFamily: 'Roboto', fontWeight: 'bold' }}>
									{category === 'E' ? 'Environmental' : category === 'S' ? 'Social' : 'Governance'}
								</Typography>
								<IconButton style={{ marginLeft: '8px' }}>
									{open[category] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</IconButton>
							</div>
							<Collapse in={open[category]}>
								<div style={{ display: 'flex', flexDirection: 'column', marginTop: '1vh' }}>
									{unselectedMetrics
										.filter(metric => metric.category === category)
										.map(filteredMetric => (
											<div key={filteredMetric.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
												<Typography style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif' }}>
													{filteredMetric.name}
												</Typography>
												<IconButton onClick={() => handleAdditionalClick(filteredMetric.id)} style={{ marginRight: '30px' }}>
													<AddIcon />
												</IconButton>
											</div>
										))}
								</div>
							</Collapse>
						</div>
					))}
				</Collapse>
			</FormControl>
    </Card>
  );
}

export default AdditionalMetrics;
