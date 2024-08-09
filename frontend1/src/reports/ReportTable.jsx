import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import ReportTableRow from "./ReportTableRow";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

//NOTE Documents have to be the parent element and its children can only be of type <Page/>
const ReportTable = ({ data }) => (
  <View style={styles.tableContainer}>
    <ReportTableRow items={data.items} />
  </View>
);

export default ReportTable;