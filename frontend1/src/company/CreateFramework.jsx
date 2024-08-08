import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import './company_css/CreateFramework.css'
import { Button, TextField } from "@mui/material";
import { getUserId, getAllMetrics, getOfficialFrameworks } from "../helper.js";
import Textarea from '@mui/joy/Textarea';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import Slider from '@mui/material/Slider';
import SelfExpiringMessage from "../assets/SelfExpiringMessage.jsx";
import CloseIcon from '@mui/icons-material/Close';

const CreateFramework = ({setOfficialFrameworks, setSelectedFramework}) => {

    const [Emetrics, setEMetrics] = useState([]);
    const [Smetrics, setSMetrics] = useState([]);
    const [Gmetrics, setGMetrics] = useState([]);
    const [value, setValue] = useState([100/3, 200/3]);
    const [isOpen, setIsOpen] = useState(false);

    const [showAddName, setShowAddName] = useState(false);
    const [newFrameworkName, setNewFrameworkName] = useState('');
    const [description, setDescription] = useState('');
    const [tempState, setTempState] = useState([]);

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

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

    const handleCloseMessage = () => {
      setShowMessage(false);
    }

    useEffect(() => {
      console.log(newFrameworkName);
    }, [newFrameworkName]);

    const handleSubmitNewFramework = async () => {
      if (newFrameworkName === null || newFrameworkName === '') {
        setMessage('Please Enter a name for your new framework');
        setShowMessage(true);
        return;
      }

      // do one for each E, S and G
      const chosenEMetrics = processMetrics(Emetrics);
      const chosenSMetrics = processMetrics(Smetrics);
      const chosenGMetrics = processMetrics(Gmetrics);

      // Combine all chosen metrics
      const chosenMetrics = [...chosenEMetrics, ...chosenSMetrics, ...chosenGMetrics];

      console.log(`Submitting Framework: ${newFrameworkName} with metrics:`);
      console.log(chosenMetrics);
      let a;
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
                setMessage('successfully created framework');
                setShowMessage(true);
                setIsOpen(false);
                console.log('SUCCESSFULLY CREATED FRAMEWORK');
                a = response.data;
                setTempState(a);
                return response.data;
          } catch (error) {
              console.log(error);
          }
        
    };

    useEffect(() => {

      const asyncFunction = async() => {
        console.log(tempState);
        let b = await getOfficialFrameworks();
        setOfficialFrameworks(b);
        setSelectedFramework(tempState);
      }

      if (tempState.length !== 0) {
        asyncFunction();
      }
    

    }, [tempState]);

    

    const handleClose = () => {
        setShowAddName(false);
        setNewFrameworkName('');
        setDescription('');
    }

    const handleChangeSlider = (event, newValue) => {
        setValue(newValue);
    };

    return (
      <div>
        <Button variant="contained" width="100%" sx={{width: '100%', margin: '2vh 0'}} 
          onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Open Create Framework'}</Button>
        {isOpen && <div className="cfw-container">
          <div className="cfw-esgdescriptor">
            <p className="cfw-esgdescriptor-content" style={{
              left:`calc(${value[0]}% / 2)`
            }}>E</p>
            <p className="cfw-esgdescriptor-content" style={{
              left:`calc(${value[0]}% + (${value[1]}% - ${value[0]}%) / 2 - 15px)`
            }}>S</p>
            <p className="cfw-esgdescriptor-content" style={{
              left:`calc(${value[1]}% + (100% - ${value[1]}%) / 2 - 23px)`
            }}>G</p>
          </div>
          <Slider 
            value = {value}
            onChange={handleChangeSlider}
            valueLabelDisplay="auto"
          />
          <AccordionGroup size={"md"}>

            <Accordion>
            <AccordionSummary>Environmental</AccordionSummary>
            <AccordionDetails>
              <div className='cfwbtn-container'>
                {Emetrics.map((metric, index) => (
                  <button className = {`cfw-button ${metric.isIncluded ? 'cfw-button-includedE' : 'cfw-button-not-included'}`}
                    key={index} 
                    onClick={() => handleEButtonClick(index)}>
                    {metric.name ? metric.name : '...'}
                  </button>
                ))}
              </div>
            </AccordionDetails>
            </Accordion>

            <Accordion>
            <AccordionSummary>Social</AccordionSummary>
            <AccordionDetails>
              <div className='cfwbtn-container'>
                {Smetrics.map((metric, index) => (
                  <button className = {`cfw-button ${metric.isIncluded ? 'cfw-button-includedS' : 'cfw-button-not-included'}`}
                    key={index} 
                    onClick={() => handleSButtonClick(index)}>
                    {metric.name ? metric.name : '...'}
                  </button>
                ))}
              </div>
            </AccordionDetails>
            </Accordion>

            <Accordion>
            <AccordionSummary>Governance</AccordionSummary>
            <AccordionDetails>
              <div className='cfwbtn-container'>
                {Gmetrics.map((metric, index) => (
                  <button className = {`cfw-button ${metric.isIncluded ? 'cfw-button-includedG' : 'cfw-button-not-included'}`}
                    key={index} 
                    onClick={() => handleGButtonClick(index)}>
                    {metric.name ? metric.name : '...'}
                  </button>
                ))}
              </div>
            </AccordionDetails>
            </Accordion>
          </AccordionGroup>
            {!showAddName && (<button className="cfw-button-www" onClick={() => setShowAddName(!showAddName)}>Create Framework</button>)}
            {showAddName && (<div>
                <div className="cfw-top-controls">
                  <button onClick={handleClose}><CloseIcon/></button>
                  <TextField onChange={(event) => setNewFrameworkName(event.target.value)} label="Framework Name" variant="standard"/>
                </div>  
                  <Textarea minRows={3} size="sm" placeholder="Describe your Framework!" onChange={(event) => setDescription(event.target.value)}/>
                <button className="cfw-button-www" onClick={() => handleSubmitNewFramework()}>save</button>
            </div>)}
        </div>}
        {showMessage && <SelfExpiringMessage message={message} onExpiry={handleCloseMessage} />}
      </div>
    )
}

export default CreateFramework;