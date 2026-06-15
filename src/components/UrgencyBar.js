import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

export default function UrgencyBar({ value, status }) {
  const color = colors[status] || colors.gray;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    flex: 1,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});
