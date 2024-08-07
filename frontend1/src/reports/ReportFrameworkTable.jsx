import React from "react";
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { replaceUnderScores } from "../helper";

const borderColor = '#0c3960'
const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#0c3960',
    },
    container: { //HEAD
        flexDirection: 'row',
        borderBottomColor: '#0c3960',
        backgroundColor: '#bed4e9',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
    },
    row: { //ROW
        flexDirection: 'row',
        borderBottomColor: '#0c3960',
        borderBottomWidth: 1,
        alignItems: 'center',
        minHeight: 24,
        fontStyle: 'normal',
        paddingVertical: 4,
    },
    metricName: {
        width: '30%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        flexGrow: 1,
        paddingLeft: 1,
        fontSize: 10,
    },
    score: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        flexGrow: 1,
        paddingLeft: 1,
        fontSize: 10,
    },
    indicatorName: {
        width: '30%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        flexGrow: 1,
        paddingLeft: 1,
        fontSize: 10,
    },
    unit: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        flexGrow: 1,
        paddingLeft: 1,
        fontSize: 10,
    },
    value: {
        width: '15%',
        flexGrow: 1,
        paddingLeft: 1,
        fontSize: 10,
    },
    indicatorNameSole: {
      width: '40%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      flexGrow: 1,
      paddingLeft: 1,
      fontSize: 10,
  },
  unitSole: {
      width: '40%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      flexGrow: 1,
      paddingLeft: 1,
      fontSize: 10,
  },
  valueSole: {
      width: '20%',
      flexGrow: 1,
      paddingLeft: 1,
      fontSize: 10,
  },
  });



const ReportFrameworkTable = ({indicatorsCompany, selectedYear, selectedFramework, selectedIndicators, metricNames, allIndicators,
    metricScores, allIndicatorsInfo, predictedScore
  }) => {
    const getName = (name) => {
        if (name === 'Yes/No') {
          return '1/0';
        } else {
          return name;
        }
    }

    const findIndicatorValue = (indicatorName) => {
        if (indicatorName in indicatorsCompany[Number(selectedYear)]) {
          return indicatorsCompany[Number(selectedYear)][indicatorName]['indicator_value'];
        } else {
          return ' ';
        }
      }


    return (
        <View>
        {selectedFramework && (
              <View style={styles.tableContainer}>
                  {/* HEADER */}
                  <View style={styles.container}>
                    {selectedYear !== 'Predicted' && (
                      <>
                        <Text style={ styles.metricName }>Metric</Text>
                        <Text style={ styles.score}>Score</Text>
                        <Text style={ styles.indicatorName }>Indicator Name</Text>
                        <Text style={ styles.unit }>Unit</Text>
                        <Text style={ styles.value }>Value</Text>
                      </>
                    )}
                    {selectedYear === 'Predicted' && (
                      <>
                        <Text style={ styles.indicatorName }>Indicator Name</Text>
                        <Text style={ styles.unit }>Unit</Text>
                        <Text style={ styles.value }>Predicted Value</Text>
                      </>
                    )}
                  </View>
                  {selectedYear !== 'Predicted' && (
                    <>
                      {Object.entries(selectedIndicators).map(([metricId, indicatorIds]) => {
                        const metricName = metricNames.find(m => m.id === Number(metricId))?.name || 'Unknown Metric';
                        const score = metricScores[metricId]?.score ?? '';
                        const indicators = allIndicators[metricId] || [];
                        console.log('NO SELECTED YEAR BUT SELECTED FW');
                        console.log(metricId);
                        console.log(indicators);
                        return (
                          indicatorIds.map((indicatorId, index) => {
                            const indicator = indicators.find(ind => ind.indicator_id === indicatorId);
                              return(
                                <View style={styles.row}>
                                    {index === 0 ? (
                                    <>
                                        <Text
                                        //   rowSpan={indicatorIds.length}
                                        style={styles.metricName}
                                        >
                                        {replaceUnderScores(metricName)}
                                        </Text>
                                        <Text
                                        //   rowSpan={indicatorIds.length}
                                        style={styles.score}
                                        >
                                        {score}
                                        </Text>
                                    </>
                                    ) : ( <>
                                        <Text style={styles.metricName}></Text>
                                        <Text style={styles.score}></Text>
                                    </>)}
                                    
                                    <Text style={styles.indicatorName}>
                                    {indicator ? replaceUnderScores(indicator.indicator_name) : ' '}
                                    </Text>
                                    <Text style={styles.unit}>
                                    {(indicator && allIndicatorsInfo) ? getName(Object.values(allIndicatorsInfo).find(item => item.id === indicator.indicator_id).unit) : ' '}
                                    </Text>
                                    <Text style={styles.value}>
                                        {indicator ? findIndicatorValue(indicator.indicator_name) : ' '}
                                    </Text>
                                </View>
                              );
                          })
                        );
                      })}
                    </>
                  )}
                  {selectedYear === 'Predicted' && (
                    <>
                      {(Object.keys(predictedScore).length > 0) && Object.values(predictedScore).map((indicator, index) => (
                        <View style={styles.row}>
                          <Text style={styles.indicatorName}>{replaceUnderScores(indicator.indicator_name)}</Text>
                          <Text style={styles.unit}>{getName(Object.values(allIndicatorsInfo).find(item => item.id === indicator.id).unit)}</Text>
                          <Text style={styles.value} align="right">{indicator.prediction}</Text>
                        </View>
                      ))}
                    </>
                  )}
              </View>

        )}
        {!selectedFramework && (
            <View>
            {selectedYear && indicatorsCompany[selectedYear] && selectedYear !== 'Predicted' && (
                <View style={styles.tableContainer}>
                  {/* TABLE HEAD */}
                  <View style={styles.container}>
                      <Text style={styles.indicatorNameSole}>Indicator Name</Text>
                      <Text style={styles.unitSole}>Unit</Text>
                      <Text style={styles.valueSole}>Indicator Value</Text>
                  </View>
                    {(selectedYear !== 'Predicted') && Object.values(indicatorsCompany[selectedYear]).map((indicator, index) => (
                      <View style={styles.row}>
                        <Text style={styles.indicatorNameSole}> {replaceUnderScores(indicator.indicator_name)} </Text>
                        <Text style={styles.unitSole}> {getName(Object.values(allIndicatorsInfo).find(item => item.name === indicator.indicator_name).unit)} </Text>
                        <Text style={styles.valueSole} align="right"> {indicator.indicator_value} </Text>
                      </View>
                    ))}
                </View>
            )}
            {selectedYear === 'Predicted' && (

                <View style={styles.tableContainer}>
                  <View style={styles.container}>
                      <Text style={styles.indicatorNameSole}>Indicator Name</Text>
                      <Text style={styles.unitSole}>Unit</Text>
                      <Text style={styles.valueSole}>Predicted Value</Text>
                  </View>
                    {(Object.keys(predictedScore).length > 0) && Object.values(predictedScore).map((indicator, index) => (
                      <View style={styles.row} key={index}>
                        <Text style={styles.indicatorNameSole}> {replaceUnderScores(indicator.indicator_name)} </Text>
                        <Text style={styles.unitSole}> {getName(Object.values(allIndicatorsInfo).find(item => item.id === indicator.id).unit)} </Text>
                        <Text style={styles.valueSole} align="right"> {indicator.prediction} </Text>
                      </View>
                    ))}
                </View>
            )}
            </View>
        )};
        </View>
    );
}

export default ReportFrameworkTable;