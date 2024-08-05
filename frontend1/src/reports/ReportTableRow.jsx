import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    width: "60%",
  },
  xyz: {
    width: "40%",
  },
});

const ReportTableRow = ({ items }) => {
  const rows = items.map((item) => (
    //<View style={styles.row} key={item.sr.toString()}> should have a key
    <View style={styles.row}>
      <Text style={styles.description}>itemDesc</Text>
      <Text style={styles.xyz}>item XYZ</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default ReportTableRow;