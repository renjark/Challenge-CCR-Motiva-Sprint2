import React from "react";
import { View } from "react-native";
import { colors } from "../styles/theme";

/** Bolinha colorida por status (critico | atencao | ok | manutencao). */
export default function StatusBadge({ status, size = 12, style }) {
  const color = colors[status] || colors.gray;
  return (
    <View
      style={[
        { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    />
  );
}
