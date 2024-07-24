import React, { useEffect, useState } from "react";
import Modal from '@mui/joy/Modal';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { Checkbox, FormGroup } from "@mui/material";

//metricsList gets passed in as [{metric_id, metricName}] ideally but we just have metricName rn
const SearchMetricsModal = ({isOpen, closeModal, metricsList}) => {
    const [metrics, setMetrics] = useState(metricsList);
    const [Emetrics, setE] = useState([]);
    const [Smetrics, setS] = useState([]);
    const [Gmetrics, setG] = useState([]);

    useEffect(async() => {
        //fetch all the metrics available and sort them into their categories
        const allMetrics = await getAllMetrics();
        //this stuff could be cached HIGHKEY!!!
        setE(allMetrics.E);
        setS(allMetrics.S);
        setG(allMetrics.G);
    },[]);


    //returns list of JsOn of form {category, id, name}
    const getAllMetrics = async() => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/metrics`,
                {headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('authToken')}`
              }});
              //if successful
              return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const handleOnClose = () => {
        //submit metrics when closing the modal
        closeModal(metrics);
    }

    const handleChange = (event, metricId) => {
        //add to list metrics
        if (event.target.checked) {
            const updatedList = [...metrics, metricId];
            setMetrics(updatedList);
        } else {
            //remove from metrics
            const updatedList = metrics.filter(m => m.metric_id !== metricId);
            setMetrics(updatedList);
        }
    }

    const AntTabs = styled(Tabs)({
        borderBottom: '1px solid #e8e8e8',
        '& .MuiTabs-indicator': {
          backgroundColor: '#1890ff',
        },
      });
      
      const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
        textTransform: 'none',
        minWidth: 0,
        [theme.breakpoints.up('sm')]: {
          minWidth: 0,
        },
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(1),
        color: 'rgba(0, 0, 0, 0.85)',
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
          color: '#40a9ff',
          opacity: 1,
        },
        '&.Mui-selected': {
          color: '#1890ff',
          fontWeight: theme.typography.fontWeightMedium,
        },
        '&.Mui-focusVisible': {
          backgroundColor: '#d1eaff',
        },
      }));

    return (
      <Modal
        open={isOpen}
        onClose={handleOnClose}
      >
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="Environmental" value="1"/>
          <AntTab label="Social" value="2"/>
          <AntTab label="Governance" value="3"/>
        </AntTabs>
        <TabPanel value="1">
          <FormGroup>
            {Emetrics.map((e) => (
                <FormControlLabel control={<Checkbox checked={metrics.some(m => m.metric_id === e.id)} onChange={(event) => handleChange(event, e.id)}/>} label={e.name} />
            ))}
          </FormGroup>
        </TabPanel>
        <TabPanel value="2">
            {Smetrics.map((e) => (
                <FormControlLabel control={<Checkbox checked={metrics.some(m => m.metric_id === e.id)} onChange={(event) => handleChange(event, e.id)}/>} label={e.name} />
            ))}
        </TabPanel>
        <TabPanel value="3">
            {Gmetrics.map((e) => (
                <FormControlLabel control={<Checkbox checked={metrics.some(m => m.metric_id === e.id)} onChange={(event) => handleChange(event, e.id)}/>} label={e.name} />
            ))}
        </TabPanel>
      </Modal>
    )
}

export default SearchMetricsModal;