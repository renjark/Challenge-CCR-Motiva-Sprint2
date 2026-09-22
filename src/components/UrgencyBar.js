import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

/** Barra de urgência 0–100 colorida pelo status do trecho. */
export default function UrgencyBar({ value = 0, status }) {
  const color = colors[status] || colors.gray;
  const largura = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${largura}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: colors.grayBorder,
    borderRadius: 4,
    flex: 1,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4 },
});
