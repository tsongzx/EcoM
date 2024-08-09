import React from "react";
import ReportBarChart from "./ReportBarChart";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { replaceUnderScores } from "../helper";

const styles = StyleSheet.create({
  graphTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Times-Roman',
    marginTop: 30,
  },
})

const ReportGraphContainer = ({ graphValues, info, categories }) => {

  return (
    <View>
      {(graphValues && Object.keys(graphValues).length > 0) ? (Object.keys(graphValues).map((graph, index) => {
        console.log('INSIDE REPORT GRAPH CONTAINER _FOR ', info[graph].name);
        console.log(graphValues[graph]);
        console.log(info[graph].unit);
        console.log(categories);

        return (
          <View>
            {/* Title */}
            <Text style={styles.graphTitle}>{replaceUnderScores(info[graph].name)}</Text>
            {/* Graph Content */}
            <ReportBarChart data={graphValues[graph]} unit={info[graph].unit ? info[graph].unit : "Metric Score"} categories={categories} />
          </View>
        );
      })) : null}
    </View>
  )
}

export default ReportGraphContainer;