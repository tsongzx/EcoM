import React, { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import { Box, Typography, Button, Paper, TextField } from '@mui/material';
import Cookies from "js-cookie";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import {
    getCompanyFromRecentlyViewed,
    getIndicatorInfo,
  } from '../helper.js';

const ReportModal = ({ isOpen, handleClose, companyId, companyName }) => {
    const [name, setName] = useState(companyName);
    const [desc, setDesc] = useState('');
    const [headCountry, setHeadCountry] = useState('');
    const [industry, setIndustry] = useState('');
    const [metrics, setMetrics] = useState();
    const [textTitleInput, setTextTitleInput] = useState('');
    const [textIntroInput, setTextIntroInput] = useState('');
    const [textConcInput, setTextConcInput] = useState('');

    useEffect( async () => {
        const company_info = await getCompanyFromRecentlyViewed(companyId);
        setHeadCountry(company_info.headquarter_country);
        setIndustry(company_info.industry);
        const company_metrics = await getCompanyMetricInfo(companyName);
        setMetrics(company_metrics);
    }, [])

    const closeReportModal = () => {
        handleClose();
    }
    
    const handleTextTitleInputChange = event => {
        setTextTitleInput(event.target.value);
    };

    const handleTextIntroInputChange = event => {
        setTextIntroInput(event.target.value);
    };

    const handleTextConcInputChange = event => {
        setTextConcInput(event.target.value);
    };

    const generatePDF = (companyId, companyName) => {
        const title = textTitleInput;
        const intro = textIntroInput;
        const conclusion = textConcInput;

        
        return <Document>
              <Page size="A4">
                <View>
                  <Text>{title}</Text>
                  <Text>{name}</Text>
                  <Text>{headCountry}</Text>
                  <Text>{industry}</Text>
                  <Text>{intro}</Text>
                  <Text>{conclusion}</Text>
                </View>
                <View>
                </View>
              </Page>
            </Document>
    }

    const getCompanyInfo = async (companyId) => {
        setHeadCountry(getCompanyFromRecentlyViewed(companyId).headquarter_country);
    }

    const getCompanyMetricInfo = (companyName) => {
        return getCompanyMetricInfo(companyName);
    }

    return (<Modal
        open={isOpen}
      >
        <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <Paper style={{ minWidth: '40%', minHeight: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 16 }}>
                <Typography variant="body2">Create New Report</Typography>
                <Button onClick={() => closeReportModal()}>X</Button>
                <Typography variant="body2">Title</Typography>
                <TextField value= {textTitleInput} onChange={handleTextTitleInputChange}/>
                <Typography variant="body2">Custom introduction</Typography>
                <TextField value= {textIntroInput} onChange={handleTextIntroInputChange}/>
                <Typography variant="body2">Custom conclusion</Typography>
                <TextField value= {textConcInput} onChange={handleTextConcInputChange}/>
                <Typography variant="body2">Customisations</Typography>
                <Typography variant="body2">Include picture</Typography>
                <PDFDownloadLink
                document={generatePDF(companyId, companyName)}
                fileName={"PDF_REPORT.pdf"}
                style={{color:'black'}}
                >{({ blob, url, loading, error }) =>
                    loading ? "Report loading..." : "Report ready to download"
                }</PDFDownloadLink>
            </Paper>
        </Box>
      </Modal>
    );
};

export default ReportModal;