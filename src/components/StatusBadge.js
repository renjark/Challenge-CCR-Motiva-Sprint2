import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

export default function StatusBadge({ status, size = 12 }) {
  const color = colors[status] || colors.gray;
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  badge: {},
});
