import React from "react";
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#bff0fd',
    },
    container: { //HEAD
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        backgroundColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
    },
    row: { //ROW
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    metricName: {
        width: '30%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        flexGrow: 1,
    },
    score: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        flexGrow: 1,
    },
    indicatorName: {
        width: '30%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        flexGrow: 1,
    },
    unit: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        flexGrow: 1,
    },
    value: {
        width: '15%',
        flexGrow: 1,
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
                        <Text style={ styles.unit }>Indicator Unit</Text>
                        <Text style={ styles.value }>Value</Text>
                      </>
                    )}
                    {selectedYear === 'Predicted' && (
                      <>
                        <Text style={ styles.indicatorName }>Indicator Name</Text>
                        <Text style={ styles.unit }>Indicator Unit</Text>
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
                        console.log(indicators);
                        return (
                          indicatorIds.map((indicatorId, index) => {
                            const indicator = indicators.find(ind => ind.indicator_id === indicatorId);

                              <View style={styles.row}>
                                {index === 0 && (
                                  <>
                                    <Text
                                    //   rowSpan={indicatorIds.length}
                                      style={styles.metricName}
                                    >
                                      {metricName}
                                    </Text>
                                    <Text
                                    //   rowSpan={indicatorIds.length}
                                      style={styles.score}
                                    >
                                      {score}
                                    </Text>
                                  </>
                                )}
                                <Text style={styles.indicatorName}>
                                  {indicator ? indicator.indicator_name : ' '}
                                </Text>
                                <Text style={styles.unit}>
                                  {(indicator && allIndicatorsInfo) ? getName(Object.values(allIndicatorsInfo).find(item => item.id === indicator.indicator_id).unit) : ' '}
                                </Text>
                                <Text style={styles.value}>
                                    {indicator ? findIndicatorValue(indicator.indicator_name) : ' '}
                                </Text>
                              </View>

                          })
                        );
                      })}
                    </>
                  )}
                  {selectedYear === 'Predicted' && (
                    <>
                      {(Object.keys(predictedScore).length > 0) && Object.values(predictedScore).map((indicator, index) => (
                        <View style={styles.row}>
                          <Text style={styles.indicatorName}>{indicator.indicator_name}</Text>
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
                      <Text style={styles.indicatorName}>Indicator Name</Text>
                      <Text style={styles.unit}>Indicator Unit</Text>
                      <Text style={styles.value}>Indicator Value</Text>
                  </View>
                    {(selectedYear !== 'Predicted') && Object.values(indicatorsCompany[selectedYear]).map((indicator, index) => (
                      <View style={styles.row}>
                        <Text style={styles.indicatorName}> {indicator.indicator_name} </Text>
                        <Text style={styles.unit}> {getName(Object.values(allIndicatorsInfo).find(item => item.name === indicator.indicator_name).unit)} </Text>
                        <Text style={styles.value} align="right"> {indicator.indicator_value} </Text>
                      </View>
                    ))}
                </View>
            )}
            {selectedYear === 'Predicted' && (

                <View style={styles.tableContainer}>
                  <View style={styles.container}>
                      <Text style={styles.indicatorName}>Indicator Name</Text>
                      <Text style={styles.unit}>Indicator Unit</Text>
                      <Text style={styles.value}>Predicted Value</Text>
                  </View>
                    {(Object.keys(predictedScore).length > 0) && Object.values(predictedScore).map((indicator, index) => (
                      <View style={styles.row} key={index}>
                        <Text style={styles.indicatorName}> {indicator.indicator_name} </Text>
                        <Text style={styles.unit}> {getName(Object.values(allIndicatorsInfo).find(item => item.id === indicator.id).unit)} </Text>
                        <Text style={styles.value} align="right"> {indicator.prediction} </Text>
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