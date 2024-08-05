import React from 'react';
import { Page, Text, Image, Document, StyleSheet, View, Font } from '@react-pdf/renderer';

//Register Fonts
// Font.register({
//   family: "Open Sans",
//   src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0b.woff2"
// });

// Font.register({
//   family: "Poppins",
//   src: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
// });

// Create styles
const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Times-Roman'
    },
    author: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: 'Times-Roman'
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: 'justify',
      fontFamily: 'Times-Roman'
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: 'center',
      color: 'grey',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
  });

export const ReportDoc = ({contentList, companyId, companyName, framework, year}) => {
  //content list is what is from Report.jsx
  const headerTypes = ['country', 'year', 'industry', 'longSummary'];

  return (
    <Document> 
        <Page size="A4" style={styles.body}>
        {/* <Text style={styles.header} fixed>
            Los Pollos Hermanos
        </Text>
        <Text style={styles.title}>The Time I And The With For Same</Text>
        <Text style={styles.author}>Desmond Benjamin</Text> */}

        {/* Title Page mapping */}
        {contentList.map(c => {
          if (c.type === 'title' && c.isDisplayed) {
            return <Text style={styles.header} fixed>{c.name}</Text>
          }
          else if (headerTypes.includes(c.type) && c.isDisplayed) {
            return <Text style={styles.subtitle}>{c.name}</Text>
          }
          // probably disallow textboxes to show on title page
        })}
        </Page>
        <Page style={styles.body}>
          {contentList.map(c => {
            if (c.type === 'text' && c.isDisplayed) {
              return <Text style={{ ...styles.text, ...{fontWeight: c.fw, fontStyle: c.italic} }}>
                {c.name}
              </Text>
            }
          })}
        </Page>
  </Document>
  );
}