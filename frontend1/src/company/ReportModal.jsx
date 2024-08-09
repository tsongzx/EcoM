import React, { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import { Box, Typography, Button, Paper, TextField } from '@mui/material';
import Cookies from "js-cookie";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import {
  fetchCompanyInfo,
  getCompanyMetrics,
  getIndicatorInfo,
} from '../helper.js';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';

const ReportModal = ({ isOpen, handleClose, companyId, companyName }) => {
  const [name, setName] = useState(companyName);
  const [desc, setDesc] = useState('This is a basic description');
  const [headCountry, setHeadCountry] = useState('Australia');
  const [industry, setIndustry] = useState('Manufacturing');
  const [metrics, setMetrics] = useState({});
  const [textTitleInput, setTextTitleInput] = useState('');
  const [textIntroInput, setTextIntroInput] = useState('');
  const [textConcInput, setTextConcInput] = useState('');

  useEffect(() => {
    const setData = async () => {
      const company_info = await fetchCompanyInfo(companyId);
      const company_metrics = await getCompanyMetrics(companyName);
      console.log(company_metrics);
      setMetrics(company_metrics);
    }
    setData();
  }, [])
  useEffect(() => {
    const someFunction = async () => {
      const company_info = await fetchCompanyInfo(companyId);
      const company_metrics = await getCompanyMetrics(companyName);
      console.log(company_metrics);
      setMetrics(company_metrics);
    };

    someFunction();
  }, []);

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
        <View style={{ margin: 30 }}>
          <View style={{ textAlign: 'center' }}>
            <Text>{title}</Text>
          </View>
          <Text>Company Name: {name}</Text>
          <Text>Company Description: {desc}</Text>
          <Text>Headquarter Country: {headCountry}</Text>
          <Text>Industry: {industry}</Text>
          <Text>Introduction: {intro}</Text>
          <Text>Conclusion: {conclusion}</Text>
        </View>
        <View>
          <Table tdStyle={{ padding: '2px' }}>
            <TH style={{ fontSize: 14 }}>
              <TD>Indicator Name</TD>
              <TD>Indicator Value</TD>
              <TD>Disclosure</TD>
            </TH>

            {/* {metrics?.map((metric, index) => <TR key={index}>
                        <TD>{metric.indicator_name}</TD>
                        <TD>{metric.indicator_value}</TD>
                        <TD>{metric.disclosure}</TD>
                    </TR>)} */}
          </Table>
        </View>
      </Page>
    </Document>
  }

  return (<Modal
    open={isOpen}
  >
    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Paper style={{ minWidth: '40%', minHeight: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 16 }}>
        <Typography variant="body2">Create New Report</Typography>
        <Button onClick={() => closeReportModal()}>X</Button>
        <Typography variant="body2">Title</Typography>
        <TextField value={textTitleInput} onChange={handleTextTitleInputChange} />
        <Typography variant="body2">Custom introduction</Typography>
        <TextField value={textIntroInput} onChange={handleTextIntroInputChange} />
        <Typography variant="body2">Custom conclusion</Typography>
        <TextField value={textConcInput} onChange={handleTextConcInputChange} />
        <Typography variant="body2">Customisations</Typography>
        <Typography variant="body2">Include picture</Typography>
        <PDFDownloadLink
          document={generatePDF(companyId, companyName)}
          fileName={"PDF_REPORT.pdf"}
          style={{ color: 'black' }}
        >{({ blob, url, loading, error }) =>
          loading ? "Report loading..." : "Report ready to download"
          }</PDFDownloadLink>
      </Paper>
    </Box>
  </Modal>
  );
};

export default ReportModal;