import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import './CreateFramework.css'
import { TextField } from "@mui/material";
import { getUserId, getMetricName } from "../helper.js";

const CreateFramework = () => {
    const [metrics, setMetrics] = useState([]);
    const [activeMetrics, setActiveMetrics] = useState([]);
    const [showAddName, setShowAddName] = useState(false);
    const [newFrameworkName, setNewFrameworkName] = useState('');

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const apiMetrics = await getAllMetrics();

                const metricPromises = apiMetrics.map(async (metric) => {
                    return { id: metric.id, name: metric.name, isIncluded: false };
                });

                const transformedMetrics = await Promise.all(metricPromises);
                setMetrics(transformedMetrics);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            }
        };

        fetchMetrics();
    }, []);

    const getAllMetrics = async() => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/metrics`,
                {headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('authToken')}`
              }});
              //if successful
              console.log('SUCCESSFULLY FETCHED METRICS');
              console.log(response.data);
              return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    //toggle the state of a button to be checked
    const handleButtonClick = (index) => {
        setMetrics(prevMetrics => {
            const newMetrics = [...prevMetrics];
            newMetrics[index].isIncluded = !newMetrics[index].isIncluded; // Toggle the isIncluded property
            return newMetrics;
        });
    }

    const handleSubmitNewFramework = async () => {
    const filteredMetrics = metrics.filter(metric => metric.isIncluded)
    const ChosenMetrics = filteredMetrics.map(metric => ({
        parent_id: -1,
        metric_id: metric.id,
        weighting: 0
    }));

        try {
            const response = await axios.post(`http://127.0.0.1:8000/framework/create`,
                {
                    details: {
                        framework_name: newFrameworkName,
                        description: "",
                        user_id: await getUserId()
                    },
                    metrics: ChosenMetrics,
                },
                {headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('authToken')}`
              }});
              //if successful
              console.log('SUCCESSFULLY FETCHED METRICS');
              return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {metrics.map((metric, index) => (
                <button className = {`button ${metric.isIncluded ? 'included' : 'not-included'}`}
                    key={index} 
                    onClick={() => handleButtonClick(index)}>
                    {metric.name ? metric.name : '...'}
                </button>
            ))}
            <button onClick={() => setShowAddName(!showAddName)}>Create Framework</button>
            {showAddName && (<div>
                <button onClick={() => setShowAddName(false)}>X</button>
                    <TextField onChange={(event) => setNewFrameworkName(event.target.value)} label="Framework Name" variant="standard" />
                <button onClick={() => handleSubmitNewFramework()}>save</button>
            </div>)}
        </div>
    )
}

export default CreateFramework;