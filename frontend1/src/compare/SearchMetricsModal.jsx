import React, { useEffect, useState } from "react";
import Modal from '@mui/joy/Modal';
import {ModalDialog, ModalClose} from '@mui/joy';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { Checkbox, FormGroup, FormControlLabel, Typography } from "@mui/material";
import { getAllMetrics } from "../helper";

//metricsList gets passed in as [{metric_id, metricName}] ideally but we just have metricName rn
const SearchMetricsModal = ({isOpen, closeModal, metricsList}) => {
    const [metrics, setMetrics] = useState([]);
    const [Emetrics, setE] = useState([]);
    const [Smetrics, setS] = useState([]);
    const [Gmetrics, setG] = useState([]);
    const [value, setValue] = useState("1");

    useEffect(() => {
      const setMetrics = async() => {
        console.log('INSIDE THE METRICS MODAL');
        //fetch all the metrics available and sort them into their categories
        const allMetrics = await getAllMetrics();
        //this stuff could be cached HIGHKEY!!!
        setE(allMetrics.E);
        setS(allMetrics.S);
        setG(allMetrics.G);
      };
      setMetrics();
    },[]);

    useEffect(() => {
      setMetrics(metricsList);
    }, [metricsList]);

    const handleOnClose = () => {
      console.log('CLOSING MODAL');
      console.log(Emetrics);
      // console.log(Emetrics);
      // console.log(Emetrics);
      //submit metrics when closing the modal
      closeModal(metrics);
    }

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const handleCheckboxChange = (event, metricId, metricName) => {
        //add to list metrics
        if (event.target.checked) {
            const updatedList = [...metrics, {metric_id: metricId, metric_name: metricName}];
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

      const ModalContent = styled('div')({
        height: '400px',
        overflowY: 'auto', 
        padding: '16px',
        width: '300px'
      });

    return (
      <Modal
        open={isOpen}
        onClose={handleOnClose}
      >
        <ModalDialog>
          <ModalClose />
            <TabContext layout="center" value={value}>
            <AntTabs value={value} onChange={handleChange} aria-label="ant example">
              <AntTab label="Environmental" value="1"/>
              <AntTab label="Social" value="2"/>
              <AntTab label="Governance" value="3"/>
            </AntTabs>
            <ModalContent>
            <TabPanel value="1">
              <FormGroup>
                {Emetrics.map((e) => (
                    <FormControlLabel control={<Checkbox disableRipple checked={metrics.some(m => m.metric_id === e.id)} onChange={(event) => handleCheckboxChange(event, e.id, e.name)}/>} label={e.name} />
                ))}
              </FormGroup>
            </TabPanel>
            <TabPanel value="2">
                {Smetrics.map((e) => (
                    <FormControlLabel control={<Checkbox disableRipple checked={metrics.some(m => m.metric_id === e.id)} onChange={(event) => handleCheckboxChange(event, e.id, e.name)}/>} label={e.name} />
                ))}
            </TabPanel>
            <TabPanel value="3">
                {Gmetrics.map((e) => (
                    <FormControlLabel control={<Checkbox disableRipple checked={metrics.some(m => m.metric_id === e.id)} onChange={(event) => handleCheckboxChange(event, e.id, e.name)}/>} label={e.name} />
                ))}
            </TabPanel>
            </ModalContent>
            </TabContext>
          </ModalDialog>
      </Modal>
    )
}

export default SearchMetricsModal;