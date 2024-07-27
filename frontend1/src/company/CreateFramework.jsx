import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import './CreateFramework.css'
import { TextField } from "@mui/material";
import { getUserId, getAllMetrics } from "../helper.js";
import Textarea from '@mui/joy/Textarea';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import Slider from '@mui/material/Slider';

const CreateFramework = () => {
    const [Emetrics, setEMetrics] = useState([]);
    const [Smetrics, setSMetrics] = useState([]);
    const [Gmetrics, setGMetrics] = useState([]);
    const [value, setValue] = useState([100/3, 200/3]);
    const [isOpen, setIsOpen] = useState(false);

    const [showAddName, setShowAddName] = useState(false);
    const [newFrameworkName, setNewFrameworkName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const apiMetrics = await getAllMetrics();

                const metricEPromises = apiMetrics.E.map(async (metric) => {
                    return { id: metric.id, name: metric.name, category: metric.category, isIncluded: false };
                });
                const metricSPromises = apiMetrics.S.map(async (metric) => {
                    return { id: metric.id, name: metric.name, category: metric.category, isIncluded: false };
                });
                const metricGPromises = apiMetrics.G.map(async (metric) => {
                    return { id: metric.id, name: metric.name, category: metric.category, isIncluded: false };
                });

                const transformedEMetrics = await Promise.all(metricEPromises);
                const transformedSMetrics = await Promise.all(metricSPromises);
                const transformedGMetrics = await Promise.all(metricGPromises);
                setEMetrics(transformedEMetrics);
                setSMetrics(transformedSMetrics);
                setGMetrics(transformedGMetrics);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            }
        };
        console.log('DOING STUFF FOR CREATEFRAMEWORK...');
        fetchMetrics();
    }, []);

    //toggle the state of a button to be checked
    const handleEButtonClick = (index) => {
        const newMetrics = [...Emetrics];
        newMetrics[index].isIncluded = !newMetrics[index].isIncluded;
        setEMetrics(newMetrics);
    }
    const handleSButtonClick = (index) => {
        const newMetrics = [...Smetrics];
        newMetrics[index].isIncluded = !newMetrics[index].isIncluded;
        setSMetrics(newMetrics);
    }
    const handleGButtonClick = (index) => {
        const newMetrics = [...Gmetrics];
        newMetrics[index].isIncluded = !newMetrics[index].isIncluded;
        setGMetrics(newMetrics);
    }

    const processMetrics = (metrics) => {
      const filteredMetrics = metrics.filter(metric => metric.isIncluded);
      // const weighting = 100 / filteredMetrics.length
      return filteredMetrics.map(metric => ({
        category: metric.category,
        metric_id: metric.id,
        weighting: 1/filteredMetrics.length
      }));
    }

    const handleSubmitNewFramework = async () => {
    // do one for each E, S and G
    const chosenEMetrics = processMetrics(Emetrics);
    const chosenSMetrics = processMetrics(Smetrics);
    const chosenGMetrics = processMetrics(Gmetrics);

    // Combine all chosen metrics
    const chosenMetrics = [...chosenEMetrics, ...chosenSMetrics, ...chosenGMetrics];

    console.log(`Submitting Framework: ${newFrameworkName} with metrics:`);
    console.log(chosenMetrics);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/framework/create/`,
                {
                    details: {
                        framework_name: newFrameworkName,
                        description: description,
                    },
                    category_weightings: {
                        E: (Math.min(...value) / 100),
                        S: (value[1] - value[0]) / 100,
                        G: (100 - value[1]) / 100,
                    },
                    metrics: chosenMetrics,
                },
                {headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('authToken')}`
              }});
              //if successful
              handleClose();
              console.log('SUCCESSFULLY CREATED FRAMEWORK');
              return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        setShowAddName(false);
        setNewFrameworkName('');
        setDescription('');
    }

    const handleChangeSlider = (event, newValue) => {
        setValue(newValue);
    };

    return (
      <div style={{ marginTop: '100px'}}>
        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Open Create Framework'}</button>
        {isOpen && <div>
          <Slider 
            value = {value}
            onChange={handleChangeSlider}
            valueLabelDisplay="auto"
          />
          <AccordionGroup size={"md"}>

            <Accordion>
            <AccordionSummary>Environmental</AccordionSummary>
            <AccordionDetails>
              {Emetrics.map((metric, index) => (
                <button className = {`button ${metric.isIncluded ? 'included' : 'not-included'}`}
                  key={index} 
                  onClick={() => handleEButtonClick(index)}>
                  {metric.name ? metric.name : '...'}
                </button>
              ))}
            </AccordionDetails>
            </Accordion>

            <Accordion>
            <AccordionSummary>Social</AccordionSummary>
            <AccordionDetails>
              {Smetrics.map((metric, index) => (
                <button className = {`button ${metric.isIncluded ? 'included' : 'not-included'}`}
                  key={index} 
                  onClick={() => handleSButtonClick(index)}>
                  {metric.name ? metric.name : '...'}
                </button>
              ))}
            </AccordionDetails>
            </Accordion>

            <Accordion>
            <AccordionSummary>Governance</AccordionSummary>
            <AccordionDetails>
              {Gmetrics.map((metric, index) => (
                <button className = {`button ${metric.isIncluded ? 'included' : 'not-included'}`}
                  key={index} 
                  onClick={() => handleGButtonClick(index)}>
                  {metric.name ? metric.name : '...'}
                </button>
              ))}
            </AccordionDetails>
            </Accordion>
          </AccordionGroup>
            {!showAddName && (<button onClick={() => setShowAddName(!showAddName)}>Create Framework</button>)}
            {showAddName && (<div>
                <button onClick={handleClose}>X</button>
                    <TextField onChange={(event) => setNewFrameworkName(event.target.value)} label="Framework Name" variant="standard"/>
                    <Textarea minRows={3} size="sm" placeholder="Describe your Framework!" onChange={(event) => setDescription(event.target.value)}/>
                <button onClick={() => handleSubmitNewFramework()}>save</button>
            </div>)}
        </div>}
      </div>
    )
}

export default CreateFramework;