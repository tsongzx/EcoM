import React, { useEffect, useState } from 'react';
import {
	FormControl,
	FormLabel,
	IconButton,
	Typography,
	Collapse,
	Card,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// This component lists out all the additional metrics that the user can add to their current framework.
// This implies 2 things:
// 1. This section won't render any metrics if no framework has been chosen
// 2. Once a user adds a metric to their framework, by default all indicators of that metric will be added too
const AdditionalMetrics = ({ selectedMetrics, metricNames, setSelectedIndicators, setSelectedMetrics,
	setMetricNames, allMetrics, setSelectedFramework, updateMetricName, exitFramework, setExitFramework
}) => {

	const [unselectedMetrics, setUnselectedMetrics] = useState([]);
	const [open, setOpen] = useState({ E: true, S: true, G: true });
	const [expanded2, setExpanded2] = useState(false);

	// This allows the user to unselect a framework
	useEffect(() => {
		if (exitFramework === true) {
			setSelectedFramework(null);
			setMetricNames(null);
			setSelectedMetrics([]);
			setSelectedIndicators({});
			setExitFramework(false);
		}
	}, [exitFramework]);

	// This function removes an additional metrics once its been chosen
	useEffect(() => {
		let unselectedMetrics1 = [];
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
		setUnselectedMetrics(unselectedMetrics1);
	}, [metricNames]);

	// This function registers the event the user clicks on one of the 'add' icon
	const handleAdditionalClick = (unselectedMetricId) => {
		let unselectedObject = {};
		for (const category in allMetrics) {
			unselectedObject = allMetrics[category].find(metric => metric.id === unselectedMetricId);
			if (unselectedObject) {
				unselectedObject.weighting = 0;
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
		updateMetricName(newMetricNames, selectedMetricsCopy, unselectedMetricId);

		// Create a new array for unselectedMetrics
		const newArray = unselectedMetrics.filter(item => item.id !== unselectedMetricId);
		setUnselectedMetrics(newArray);
	}

	const handleCategoryClick = (category) => {
		setOpen(prevOpen => ({ ...prevOpen, [category]: !prevOpen[category] }));
	};

	const handleExpandClick2 = () => {
		setExpanded2(!expanded2);
	};

	return (
		<Card style={{ display: 'flex', flexDirection: 'column', marginTop: '2vh' }}>
			<FormControl style={{ marginLeft: '1.5vw', display: 'flex', flexDirection: 'column', flex: '1' }} component="fieldset">
				<FormLabel component="legend" onClick={handleExpandClick2} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
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
